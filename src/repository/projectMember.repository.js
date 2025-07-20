import { ProjectMember } from '../models/index.js';
import CrudRepository from './crud.repository.js';

class ProjectMemberRepository extends CrudRepository {
  constructor() {
    super(ProjectMember);
  }
}

export default new ProjectMemberRepository();
