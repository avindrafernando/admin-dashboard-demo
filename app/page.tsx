import { getUsers } from '@/lib/db';
import { auth } from '@/lib/auth';
import { UsersTable } from './users-table';
import { Search } from './search';
import { UserDialog } from './user-dialog';

export default async function IndexPage(props: {
  searchParams: Promise<{ q: string; offset: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const [{ users, newOffset }, session] = await Promise.all([
    getUsers(search, Number(offset)),
    auth()
  ]);
  const canWrite = Boolean(session?.user);

  return (
    <main className="flex flex-1 flex-col p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {canWrite
            ? 'Search, add, and manage people in this demo.'
            : 'Search the list. Sign in to add, edit, or delete users.'}
        </p>
      </div>
      <div className="mb-4 flex w-full flex-col gap-3 sm:flex-row">
        <div className="sm:flex-1">
          <Search value={searchParams.q} />
        </div>
        {canWrite && <UserDialog />}
      </div>
      <div className="overflow-hidden rounded-xl border bg-card">
        <UsersTable users={users} offset={newOffset} canWrite={canWrite} />
      </div>
    </main>
  );
}
