// src/models/Issue.js
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { ENUMS } from '../utils/common/index.js';
import AppError from '../utils/errors/appError.js';

const issue = ENUMS.ISSUE;
const priority = ENUMS.PRIORITY;

const attachmentSubSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    size: { type: Number, min: 0 },
    mime: {
      type: String,
      trim: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: [50, 'Title can not be more than 50 characters'],
      trim: true
    },

    type: {
      type: String,
      required: true,
      enum: [issue.TASK, issue.STORY, issue.SUBTASK, issue.BUG],
      index: true
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },

    // Parent issue (for Story→Task, Task→Bug, Task→Subtask, etc.)
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      default: null,
      index: true
    },

    // Direct Epic link (usually for Story; Task/Bug/Subtask can inherit via parent chain)
    epic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Epic',
      default: null,
      index: true
    },

    priority: {
      type: String,
      enum: [
        priority.LOW,
        priority.MEDIUM,
        priority.HIGH,
        priority.CRITICAL,
        priority.BLOCKER
      ],
      default: priority.MEDIUM,
      index: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // set this explicitly on updates
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description can not be more than 500 characters'],
      trim: true
    },

    attachments: [attachmentSubSchema],

    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stage',
      required: true,
      index: true
    },

    dueDate: { type: Date },

    // Estimates stored in MINUTES for easy math
    originalEstimate: { type: Number, default: 0, min: 0 },
    spentEstimate: { type: Number, default: 0, min: 0 },

    // Optional labels / watchers
    labels: [
      {
        type: String,
        trim: true
      }
    ],
    watchers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]

    // Optional soft-delete
    // isDeleted: { type: Boolean, default: false, index: true },
    // deletedAt: { type: Date },
    // deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/* ---------- Virtuals (derived, not stored) ---------- */
issueSchema.virtual('remainingEstimate').get(function () {
  const orig = this.originalEstimate || 0;
  const spent = this.spentEstimate || 0;
  return Math.max(0, orig - spent);
});

issueSchema.virtual('overrunMinutes').get(function () {
  const orig = this.originalEstimate || 0;
  const spent = this.spentEstimate || 0;
  return spent > orig ? spent - orig : 0;
});

/* ---------- Indexes for common queries ---------- */
issueSchema.index({ project: 1, epic: 1 });
issueSchema.index({ project: 1, parent: 1 });
issueSchema.index({ project: 1, assignee: 1, stage: 1 });
issueSchema.index({ project: 1, type: 1, priority: 1 });

/* ---------- Validation / Defaults (with AppError) ---------- */
issueSchema.pre('validate', async function (next) {
  try {
    // 1) Ensure default Stage before required validation triggers
    if (!this.stage) {
      const defaultStage = await mongoose
        .model('Stage')
        .findOne({ isDefault: true })
        .select('_id');

      if (defaultStage) {
        this.stage = defaultStage._id;
      } else {
        return next(
          new AppError(
            ['No default Stage configured.'],
            StatusCodes.BAD_REQUEST
          )
        );
      }
    }

    // 2) Parent rules (same project, allowed combos, no self-parent)
    if (this.parent) {
      if (this.parent.equals?.(this._id)) {
        return next(
          new AppError(
            ['Issue cannot be its own parent.'],
            StatusCodes.BAD_REQUEST
          )
        );
      }

      const Parent = await mongoose
        .model('Issue')
        .findById(this.parent)
        .select('project type epic parent');

      if (!Parent) {
        return next(
          new AppError(['Parent issue not found.'], StatusCodes.NOT_FOUND)
        );
      }

      if (String(Parent.project) !== String(this.project)) {
        return next(
          new AppError(
            ['Parent must be in the same project.'],
            StatusCodes.BAD_REQUEST
          )
        );
      }

      const t = this.type;
      const pt = Parent.type;

      // Enforce your hierarchy rules
      if (t === issue.TASK && pt !== issue.STORY) {
        return next(
          new AppError(
            ['Task must have a Story as parent.'],
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (t === issue.BUG && ![issue.STORY, issue.TASK].includes(pt)) {
        return next(
          new AppError(
            ['Bug must have a Story or Task as parent.'],
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (t === issue.SUBTASK && pt !== issue.TASK) {
        return next(
          new AppError(
            ['Subtask must have a Task as parent.'],
            StatusCodes.BAD_REQUEST
          )
        );
      }

      // 3) Prevent cycles in Issue→Issue chains
      const seen = new Set([String(this._id)]);
      let cur = Parent;
      while (cur?.parent) {
        const id = String(cur._id);
        if (seen.has(id)) {
          return next(
            new AppError(
              ['Cycle detected in issue hierarchy.'],
              StatusCodes.BAD_REQUEST
            )
          );
        }
        seen.add(id);
        cur = await mongoose
          .model('Issue')
          .findById(cur.parent)
          .select('parent');
      }
    }

    // 3) Epic rules (same project)
    if (this.epic) {
      const Epic = await mongoose
        .model('Epic')
        .findById(this.epic)
        .select('project');

      if (!Epic) {
        return next(new AppError(['Epic not found.'], StatusCodes.NOT_FOUND));
      }

      if (String(Epic.project) !== String(this.project)) {
        return next(
          new AppError(
            ['Epic must be in the same project.'],
            StatusCodes.BAD_REQUEST
          )
        );
      }
    }

    // 4) Auto-infer epic from parent chain if not explicitly set
    if (!this.epic && this.parent) {
      const Issue = mongoose.model('Issue');
      let cur = await Issue.findById(this.parent).select('epic parent');
      while (cur && !cur.epic && cur.parent) {
        cur = await Issue.findById(cur.parent).select('epic parent');
      }
      if (cur?.epic) this.epic = cur.epic;
    }

    next();
  } catch (err) {
    next(
      err instanceof AppError
        ? err
        : new AppError(
            [err?.message || 'Something went wrong while validating issue.'],
            StatusCodes.INTERNAL_SERVER_ERROR
          )
    );
  }
});

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
