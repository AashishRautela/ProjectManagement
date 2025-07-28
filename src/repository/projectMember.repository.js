import { StatusCodes } from 'http-status-codes';
import { ProjectMember } from '../models/index.js';
import CrudRepository from './crud.repository.js';

class ProjectMemberRepository extends CrudRepository {
  constructor() {
    super(ProjectMember);
  }

  async findByIdAndDelete(data) {
    const { projectId, memberId } = data;
    const response = await ProjectMember.findOneAndDelete({
      project: projectId,
      _id: memberId
    });
    if (!response) {
      throw new AppError(['Member Not found'], StatusCodes.NOT_FOUND);
    }
    return response;
  }
}

export default new ProjectMemberRepository();
