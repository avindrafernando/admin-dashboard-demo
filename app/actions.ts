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
  await deleteUserById(userId);
  revalidatePath('/');
}

export async function updateUser(user: SelectUser, formData: FormData) {
  const updatedUser: SelectUser = {
    id: user.id,
    name: String(formData.get('name')) ?? user.name,
    email: String(formData.get('email')) ?? user.email,
    username: String(formData.get('username')) ?? user.username
  };

  await updateUserById(updatedUser);
  revalidatePath('/');
}

export async function addUser(formData: FormData) {
  const newUser: SelectUserWithoutId = {
    name: String(formData.get('name')) ?? '',
    email: String(formData.get('email')) ?? '',
    username: String(formData.get('username')) ?? ''
  };

  await createUser(newUser);
  revalidatePath('/');
}
