'use server';

import { createUser, deleteUserById, updateUserById } from '@/lib/db';
import { requireSession } from '@/lib/auth';
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

const signedOutState: FormState = {
  status: 'error',
  message: 'You must be signed in to do that'
};

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters')
});

const userIdSchema = z.string().uuid();

export async function deleteUser(userId: string) {
  await requireSession();

  const parsedId = userIdSchema.safeParse(userId);
  if (!parsedId.success) {
    throw new Error('Failed to delete user', { cause: parsedId.error });
  }

  try {
    await deleteUserById(parsedId.data);
  } catch (e) {
    throw new Error('Failed to delete user', { cause: e });
  }

  revalidatePath('/');
}

export async function updateUser(
  userId: string,
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await requireSession();
  } catch {
    return signedOutState;
  }

  const parsedId = userIdSchema.safeParse(userId);
  if (!parsedId.success) {
    throw new Error('Failed to update user', { cause: parsedId.error });
  }

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

  try {
    await updateUserById({
      id: parsedId.data,
      ...validatedFields.data
    });
  } catch (e) {
    throw new Error('Failed to update user', { cause: e });
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
  try {
    await requireSession();
  } catch {
    return signedOutState;
  }

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

  try {
    await createUser(validatedFields.data);
  } catch (e) {
    throw new Error('Failed to add user', { cause: e });
  }

  revalidatePath('/');

  return {
    status: 'success',
    message: 'User added successfully'
  };
}
