import { StatusCodes } from 'http-status-codes';
import { IssueRepository, ProjectRepository } from '../repository/index.js';
import { ENUMS } from '../utils/common/index.js';
import AppError from '../utils/errors/appError.js';
const issue = ENUMS.ISSUE;
const priority = ENUMS.PRIORITY;

export const createIssue = async (data, user) => {
  try {
    let assignee = data?.assignee || null;
    let reporter = data?.reporter || null;

    const project = await ProjectRepository.findByPk(data.projectId);
    if (!assignee) {
      const defaultAssignee = project.defaultAssignee;
      assignee = defaultAssignee?._id;
    }

    if (!reporter) {
      const defaultReporter = project.manager;
      reporter = defaultReporter?._id;
    }

    const key = await ProjectRepository.reserveIssueKey(data.projectId, {});

    const payload = {
      title: data.title,
      type: data.type,
      project: data.projectId,
      epic: data.epic || null,
      parent: data.parent || null,
      priority: data.priority || priority.MEDIUM,
      createdBy: user._id,
      updatedBy: user._id,
      assignee,
      reporter,
      description: data.description,
      stage: data.stage,
      key
    };

    const issue = await IssueRepository.create(payload);

    if (!issue) {
      throw new AppError(
        ['Something went wrong while creating issue'],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    return issue;
  } catch (error) {
    console.log('error in issue creating--->', error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ['Something went wrong while creating issue'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getIssueDetails = async (data) => {
  try {
    const issue = await IssueRepository.findByPk(data);
    return issue;
  } catch (error) {
    console.log('error in issue details--->', error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ['Something went wrong while getting issue details'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
