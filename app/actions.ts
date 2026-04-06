'use server';

import {
  deleteUserById,
  SelectUser,
  updateUserById,
  createUser,
  SelectUserWithoutId
} from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type FieldError = {
  name?: string[];
  email?: string[];
  username?: string[];
};

export type FormState = {
  message: string;
  status: 'idle' | 'pending' | 'error' | 'success';
  errors?: FieldError;
};

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters')
});

export async function deleteUser(userId: string) {
  try {
    await deleteUserById(userId);
  } catch (e) {
    throw new Error('Failed to delete user');
  }

  revalidatePath('/');
}

export async function updateUser(
  user: SelectUser,
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = userSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    username: formData.get('username')
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Validation failed',
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

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

  return {
    status: 'success',
    message: 'User updated successfully'
  };
}

export async function addUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = userSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    username: formData.get('username')
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Validation failed',
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

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

  return {
    status: 'success',
    message: 'User added successfully'
  };
}
