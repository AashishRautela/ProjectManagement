import { StatusCodes } from 'http-status-codes';
import { Issue } from '../models/index.js';
import CrudRepository from './crud.repository.js';
import AppError from '../utils/errors/appError.js';

class IssueRepository extends CrudRepository {
  constructor() {
    super(Issue);
  }

  async findByPk(data) {
    const response = await this.model
      .findById(data)
      .populate([
        {
          path: 'createdBy',
          select: '-isVerified -createdAt -updatedAt -email -__v'
        },
        {
          path: 'assignee',
          select: '-isVerified -createdAt -updatedAt -email -__v'
        },
        {
          path: 'reporter',
          select: '-isVerified -createdAt -updatedAt -email -__v'
        },
        {
          path: 'updatedBy',
          select: '-isVerified -createdAt -updatedAt -email -__v'
        },
        { path: 'epic', select: '_id title key' },
        { path: 'parent', select: '_id title type' },
        { path: 'stage', select: '_id name color' }
      ])
      .select('-project');

    if (!response) {
      throw new AppError(['Issue Not found'], StatusCodes.NOT_FOUND);
    }
    return response;
  }
}

export default new IssueRepository();
