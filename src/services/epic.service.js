import { StatusCodes } from 'http-status-codes';
import { EpicRepository, ProjectRepository } from '../repository/index.js';
import AppError from '../utils/errors/appError.js';

export const createEpic = async (data, user) => {
  console.log('data--->', data);
  try {
    let assignee = data.assignee;
    let reporter = data.reporter;

    const project = await ProjectRepository.findByPk(data.projectId);
    if (!assignee) {
      const defaultAssignee = project.defaultAssignee;
      assignee = defaultAssignee?._id;
    }

    if (!reporter) {
      const defaultReporter = project.maanger;
      reporter = defaultReporter?._id;
    }
    const key = await ProjectRepository.reserveIssueKey(data.projectId, {});
    console.log('key-->', key);
    const payload = {
      title: data.title,
      project: data.projectId,
      createdBy: user._id,
      summary: data.summary || '',
      description: data.description || '',
      startDate: data.startDate || null,
      dueDate: data.dueDate || null,
      assignee,
      reporter,
      key
    };

    const epic = await EpicRepository.create(payload);

    if (!epic) {
      throw new AppError(
        ['Something went wrong while creating epic'],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    return;
  } catch (error) {
    console.log('error in epic creating--->', error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ['Something went wrong while creating epic'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
