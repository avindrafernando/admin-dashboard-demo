'use server';

import { createUser, deleteUserById, updateUserById } from '@/lib/db';
import { getSession, sessionCanWrite } from '@/lib/auth';
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

function signedOutState(): FormState {
  return {
    status: 'error',
    message: 'You must be signed in to do that'
  };
}

function unauthorizedState(): FormState {
  return {
    status: 'error',
    message: 'You are not allowed to do that'
  };
}

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters')
});

const userIdSchema = z.string().uuid();

async function authorizeWrite(): Promise<FormState | null> {
  const session = await getSession();
  if (!session) {
    return signedOutState();
  }

  if (!sessionCanWrite(session)) {
    return unauthorizedState();
  }

  return null;
}

export async function deleteUser(userId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error('You must be signed in to do that');
  }

  if (!sessionCanWrite(session)) {
    throw new Error('You are not allowed to do that');
  }

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
  const denied = await authorizeWrite();
  if (denied) {
    return denied;
  }

  const parsedId = userIdSchema.safeParse(userId);
  if (!parsedId.success) {
    return {
      status: 'error',
      message: 'Invalid user'
    };
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
  const denied = await authorizeWrite();
  if (denied) {
    return denied;
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
