import { apiInstance } from '~/shared/api';
import type { UserDTO, UserWithoutIdDto } from '../types';

export const updateUser = async (updateData: Partial<UserWithoutIdDto>) => {
	const updatedUser = await apiInstance.patch<UserDTO>('/user/me', updateData);

	return updatedUser;
};
