'use server';

import {
  deleteUserById,
  SelectUser,
  updateUserById,
  createUser,
  SelectUserWithoutId
} from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteUser(userId: string) {
  try {
    await deleteUserById(userId);
  } catch (e) {
    throw new Error('Failed to delete user');
  }

  revalidatePath('/');
}

export async function updateUser(user: SelectUser, formData: FormData) {
  const updatedUser: SelectUser = {
    id: user.id,
    name: String(formData.get('name')) ?? user.name,
    email: String(formData.get('email')) ?? user.email,
    username: String(formData.get('username')) ?? user.username
  };

  try {
    await updateUserById(updatedUser);
  } catch (e) {
    throw new Error('Failed to update user');
  }

  revalidatePath('/');
}

export async function addUser(formData: FormData) {
  const newUser: SelectUserWithoutId = {
    name: String(formData.get('name')) ?? '',
    email: String(formData.get('email')) ?? '',
    username: String(formData.get('username')) ?? ''
  };

  try {
    await createUser(newUser);
  } catch (e) {
    throw new Error('Failed to add user');
  }
  revalidatePath('/');
}
