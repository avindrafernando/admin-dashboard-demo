'use server';

import {
  deleteUserById,
  SelectUser,
  updateUserById,
  createUser,
  SelectUserWithoutId
} from '@/lib/db';

export async function deleteUser(userId: string) {
  await deleteUserById(userId);
}

export async function updateUser(user: SelectUser, formData: FormData) {
  const updatedUser: SelectUser = {
    id: user.id,
    name: String(formData.get('name')) ?? user.name,
    email: String(formData.get('email')) ?? user.email,
    username: String(formData.get('username')) ?? user.username
  };

  await updateUserById(updatedUser);
}

export async function addUser(formData: FormData) {
  const newUser: SelectUserWithoutId = {
    name: String(formData.get('name')) ?? '',
    email: String(formData.get('email')) ?? '',
    username: String(formData.get('username')) ?? ''
  };

  await createUser(newUser);
}
