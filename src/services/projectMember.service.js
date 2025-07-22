import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/errors/appError.js';
import { ProjectMemberRepository } from '../repository/index.js';
import { ErrorResponse } from '../utils/common/index.js';

export const addMember = async (data, user) => {
  const errorResponse = ErrorResponse();
  try {
    const membersPayload = data.members.map((member) => {
      return {
        addedBy: user._id,
        updatedBy: user._id,
        user: member.user,
        status: 'active',
        role: member.role,
        project: data.projectId
      };
    });

    const members = await ProjectMemberRepository.insertMany(membersPayload);
    console.log('membersPayload--->', membersPayload);
    console.log('members', members);
    return;
  } catch (error) {
    console.log('error -->1', error);
    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while adding member'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
