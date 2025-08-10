import { StatusCodes } from 'http-status-codes';
import { Epic } from '../models/index.js';
import CrudRepository from './crud.repository.js';

class EpicRepository extends CrudRepository {
  constructor() {
    super(Epic);
  }

  async findByPk(data) {
    const response = await this.model
      .findById(data)
      .populate([
        { path: 'createdBy', select: '-isVerified -createdAt -updatedAt -__v' },
        { path: 'assignee', select: '-isVerified -createdAt -updatedAt -__v' }
      ])
      .select('-project');

    if (!response) {
      throw new AppError(['Epic Not found'], StatusCodes.NOT_FOUND);
    }
    return response;
  }
}

export default new EpicRepository();
