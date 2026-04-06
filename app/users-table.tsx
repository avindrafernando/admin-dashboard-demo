'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SelectUser } from '@/lib/db';
import { deleteUser } from './actions';
import { useRouter } from 'next/navigation';
import { UserDialog } from './user-dialog';
import { useTransition } from 'react';
import { ButtonSpinner } from '@/components/icons';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorContainer } from './error';

export function UsersTable({
  users,
  offset
}: {
  users: SelectUser[];
  offset: number | null;
}) {
  const router = useRouter();

  function onClick() {
    router.replace(`/?offset=${offset}`);
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="max-w-[150px]">Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Username</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
      {offset !== null && (
        <Button
          className="mt-4 w-40"
          variant="secondary"
          onClick={() => onClick()}
        >
          Next Page
        </Button>
      )}
    </>
  );
}

function UserRow({ user }: { user: SelectUser }) {
  const userId = user.id;
  const deleteUserWithId = deleteUser.bind(null, userId);
  const [isPending, startTransition] = useTransition();

  return (
    <ErrorBoundary fallback={<ErrorContainer />}>
      <TableRow>
        <TableCell className="font-medium">{user.name}</TableCell>
        <TableCell className="hidden md:table-cell">{user.email}</TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell>
          <UserDialog user={user} />
        </TableCell>
        <TableCell>
          <Button
            className="w-full"
            size="sm"
            variant="outline"
            onClick={() => startTransition(() => deleteUserWithId())}
          >
            {isPending && <ButtonSpinner />}
            Delete
          </Button>
        </TableCell>
      </TableRow>
    </ErrorBoundary>
  );
}
