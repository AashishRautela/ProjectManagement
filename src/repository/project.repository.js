import CrudRepository from './crud.repository.js';
import { Project } from '../models/index.js';

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
}

export default new ProjectRepository();
