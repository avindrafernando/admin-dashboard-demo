'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectUser } from '@/lib/db';
import { addUser, FormState, updateUser } from './actions';
import { useActionState, useState } from 'react';
import { ButtonSpinner } from '@/components/icons';

const initialState: FormState = {
  message: '',
  status: 'idle'
};

export function UserDialog({ user }: { user?: SelectUser }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    user ? updateUser.bind(null, user.id) : addUser,
    initialState
  );
  const [wasPending, setWasPending] = useState(isPending);

  if (wasPending !== isPending) {
    setWasPending(isPending);
  }

  if (wasPending && !isPending && state.status === 'success' && open) {
    setOpen(false);
  }

  const showErrors = state?.status === 'error';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={user ? 'w-full' : 'w-full sm:w-auto'} variant={user ? 'outline' : 'default'}>
          {user ? 'Edit' : 'Add user'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit' : 'Add'} user</DialogTitle>
          <DialogDescription>
            Make changes to the user here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user?.name ?? ''}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                // type="email" would block invalid values in the browser
                // before Zod can run the server-side email check.
                defaultValue={user?.email ?? ''}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                defaultValue={user?.username ?? ''}
              />
            </div>
            {showErrors && (
              <div
                id="form-error"
                aria-live="polite"
                className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {state.errors?.name?.map((error: string) => (
                  <p key={error}>{error}</p>
                ))}
                {state.errors?.email?.map((error: string) => (
                  <p key={error}>{error}</p>
                ))}
                {state.errors?.username?.map((error: string) => (
                  <p key={error}>{error}</p>
                ))}
                {!state.errors && state.message ? <p>{state.message}</p> : null}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" formAction={formAction} disabled={isPending}>
              {isPending && <ButtonSpinner />}
              {isPending ? 'Saving' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
