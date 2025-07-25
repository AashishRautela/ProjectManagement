import mongoose from 'mongoose';

const projectMemberSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'invited', 'removed'],
      default: 'active'
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

projectMemberSchema.index({ project: 1, user: 1 }, { unique: true });
const ProjectMember = mongoose.model('ProjectMember', projectMemberSchema);

export default ProjectMember;
