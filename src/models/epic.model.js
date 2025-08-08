import mongoose from 'mongoose';
import { ENUMS } from '../utils/common/index.js';

const priority = ENUMS.PRIORITY;

const epicSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true
    },
    summary: {
      type: String
    },
    description: {
      type: String
    },
    startDate: {
      type: Date
    },
    dueDate: {
      type: Date
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    defaultAssignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stage'
    },
    icon: {
      type: String,
      default: ''
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
      default: priority.MEDIUM
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Epic = new mongoose.model('Epic', epicSchema);

export default Epic;
