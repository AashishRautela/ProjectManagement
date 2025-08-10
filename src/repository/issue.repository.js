import { Issue } from '../models/index.js';
import CrudRepository from './crud.repository.js';

class IssueRepository extends CrudRepository {
  constructor() {
    super(Issue);
  }
}

export default new IssueRepository();
