import { StatusCodes } from 'http-status-codes';
import {
  ProjectRepository,
  ProjectMemberRepository,
  RoleRepository
} from '../repository/index.js';
import AppError from '../utils/errors/appError.js';
import mongoose from 'mongoose';

export const create = async (data, user) => {
  let session;
  try {
    const { name, description = '', key = '', startDate, endDate } = data;

    const existing = await ProjectRepository.findOne({ name: name.trim() });
    if (existing) {
      throw new AppError(
        ['Project exists with the same name'],
        StatusCodes.BAD_REQUEST
      );
    }

    const start = startDate ? new Date(startDate) : new Date();
    if (endDate && new Date(endDate) <= start) {
      throw new AppError(
        ['End date must be after start date'],
        StatusCodes.BAD_REQUEST
      );
    }

    const projectPayload = {
      name: name.trim(),
      description: description.trim(),
      key: key.trim() || null,
      startDate: start,
      endDate: endDate ? new Date(endDate) : undefined,
      manager: data.manager || user._id,
      defaultAssignee: data.defaultAssignee || user._id,
      createdBy: user._id,
      updatedBy: user._id
    };

    session = await mongoose.startSession();
    let createdProject;

    await session.withTransaction(async () => {
      const project = await ProjectRepository.create(projectPayload, {
        session
      });
      createdProject = project;

      const role = await RoleRepository.findOne({ name: 'admin' });
      if (!role) {
        throw new AppError(
          ['Admin role not found'],
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const memberPayload = {
        project: project._id,
        user: user._id,
        role: role._id,
        status: 'active',
        addedBy: user._id,
        updatedBy: user._id
      };

      await ProjectMemberRepository.create(memberPayload, { session });
    });

    return;
  } catch (error) {
    console.error('error -->', error);
    if (session) await session.endSession();

    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while creating project'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  } finally {
    if (session) session.endSession();
  }
};

export const getProjectDetails = async (data) => {
  try {
    const project = await ProjectRepository.findByPk(data);

    if (!project) {
      throw new AppError(['Project Not found'], StatusCodes.NOT_FOUND);
    }

    return project;
  } catch (error) {
    console.error('error -->', error);

    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while getting project details'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
