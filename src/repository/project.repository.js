import CrudRepository from './crud.repository.js';
import { Project } from '../models/index.js';
import AppError from '../utils/errors/appError.js';

class ProjectRepository extends CrudRepository {
  constructor() {
    super(Project);
  }

  async findByPk(data) {
    const response = await this.model.findById(data).populate([
      { path: 'createdBy', select: '-isVerified -createdAt -updatedAt -__v' },
      { path: 'updatedBy', select: '-isVerified -createdAt -updatedAt -__v' },
      { path: 'manager', select: '-isVerified -createdAt -updatedAt -__v' },
      {
        path: 'defaultAssignee',
        select: '-isVerified -createdAt -updatedAt -__v'
      }
    ]);

    if (!response) {
      throw new AppError(['Resouce Not found'], StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async reserveIssueKey(projectId, options = {}) {
    console.log('projectId---->', projectId);
    return await Project.reserveIssueKey(projectId);
  }
}

export default new ProjectRepository();
