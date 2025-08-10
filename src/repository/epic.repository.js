import { Epic } from '../models/index.js';
import CrudRepository from './crud.repository.js';

class EpicRepository extends CrudRepository {
  constructor() {
    super(Epic);
  }
}

export default new EpicRepository();
