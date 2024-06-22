import { getUsers } from '@/lib/db';
import { UsersTable } from './users-table';
import { Search } from './search';
import { UserDialog } from './user-dialog';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { users, newOffset } = await getUsers(search, Number(offset));

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Users</h1>
      </div>
      <div className="w-full mb-4 flex">
        <div className="w-4/5">
          <Search value={searchParams.q} />
        </div>
        <div className="w-1/5 ml-4">
          <UserDialog />
        </div>
      </div>
      <UsersTable users={users} offset={newOffset} />
    </main>
  );
}
