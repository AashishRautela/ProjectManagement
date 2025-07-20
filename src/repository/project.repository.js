import CrudRepository from './crud.repository.js';
import { Project } from '../models/index.js';

class ProjectRepository extends CrudRepository {
  constructor() {
    super(Project);
  }
}

export default new ProjectRepository();
