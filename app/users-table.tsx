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
import { useState, useTransition } from 'react';
import { ButtonSpinner } from '@/components/icons';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorContainer } from './error';
import { cn } from '@/lib/utils';

export function UsersTable({
  users,
  offset,
  canWrite
}: {
  users: SelectUser[];
  offset: number | null;
  canWrite: boolean;
}) {
  const router = useRouter();

  function onClick() {
    router.replace(`/?offset=${offset}`);
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Username</TableHead>
            {canWrite && (
              <TableHead className="w-[1%]">
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} canWrite={canWrite} />
          ))}
        </TableBody>
      </Table>
      {offset !== null && (
        <div className="border-t px-4 py-3">
          <Button variant="outline" size="sm" onClick={() => onClick()}>
            Next page
          </Button>
        </div>
      )}
    </>
  );
}

function UserRow({
  user,
  canWrite
}: {
  user: SelectUser;
  canWrite: boolean;
}) {
  const userId = user.id;
  const deleteUserWithId = deleteUser.bind(null, userId);
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  return (
    <ErrorBoundary fallback={<ErrorContainer />}>
      <TableRow className={cn(isPending && 'opacity-60')}>
        <TableCell>
          <div className="font-medium">{user.name}</div>
          <div className="mt-0.5 text-muted-foreground md:hidden">
            {user.username}
          </div>
        </TableCell>
        <TableCell className="hidden text-muted-foreground md:table-cell">
          {user.email}
        </TableCell>
        <TableCell className="hidden text-muted-foreground md:table-cell">
          {user.username}
        </TableCell>
        {canWrite && (
          <TableCell>
            <div className="flex justify-end gap-2">
              <UserDialog user={user} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteError(null);
                  startTransition(async () => {
                    try {
                      await deleteUserWithId();
                    } catch (error) {
                      setDeleteError(
                        error instanceof Error
                          ? error.message
                          : 'You must be signed in to do that'
                      );
                    }
                  });
                }}
              >
                {isPending && <ButtonSpinner />}
                {isPending ? 'Deleting' : 'Delete'}
              </Button>
              {deleteError ? (
                <p className="max-w-40 text-xs text-destructive" role="alert">
                  {deleteError}
                </p>
              ) : null}
            </div>
          </TableCell>
        )}
      </TableRow>
    </ErrorBoundary>
  );
}
