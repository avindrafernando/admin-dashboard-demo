import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { eq, ilike } from 'drizzle-orm';

export const db = drizzle(
  neon(process.env.POSTGRES_URL!, {
    fetchOptions: {
      cache: 'no-store'
    }
  })
);

const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }),
  username: varchar('username', { length: 50 }),
  email: varchar('email', { length: 50 })
});

export type SelectUser = typeof users.$inferSelect;
export type SelectUserWithoutId = Omit<SelectUser, 'id'>;

export async function getUsers(
  search: string,
  offset: number
): Promise<{
  users: SelectUser[];
  newOffset: number | null;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      users: await db
        .select()
        .from(users)
        .where(ilike(users.name, `%${search}%`))
        .limit(1000),
      newOffset: null
    };
  }

  if (offset === null) {
    return { users: [], newOffset: null };
  }

  const moreUsers = await db.select().from(users).limit(20).offset(offset);
  const newOffset = moreUsers.length >= 20 ? offset + 20 : null;
  return { users: moreUsers, newOffset };
}

export async function deleteUserById(id: string) {
  await db.delete(users).where(eq(users.id, id));
}

export async function updateUserById(user: SelectUser) {
  await db
    .update(users)
    .set({ name: user.name, email: user.email, username: user.username })
    .where(eq(users.id, user.id));
}

export async function createUser(user: SelectUserWithoutId) {
  await db.insert(users).values(user);
}
