import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/errors/appError.js';

class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const response = await this.model.create(data);
    return response;
  }

  async get(data) {
    const response = await this.model.findById(data);
    if (!response) {
      throw new AppError(['Resource not found'], StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async find(data) {
    const response = this.model.findOne(data);
    if (!response) {
      throw new AppError(['Resouce Not found'], StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async findOne(data) {
    const response = this.model.findOne(data);
    return response;
  }

  async findByPk(data) {
    const response = this.model.findById(data);
    return response;
  }
}

export default CrudRepository;
