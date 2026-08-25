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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="sm" variant="outline">
          {user ? 'Edit' : 'Add'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit' : 'Add'} User</DialogTitle>
          <DialogDescription>
            Make changes to the user here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                className="col-span-3"
                defaultValue={user?.name ?? ''}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                // type="email" would block invalid values in the browser
                // before Zod can run the server-side email check.
                className="col-span-3"
                defaultValue={user?.email ?? ''}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                className="col-span-3"
                defaultValue={user?.username ?? ''}
              />
            </div>
            {state && state.status === 'error' && state.errors && (
              <div
                id="email-error"
                aria-live="polite"
                className="text-sm text-red-500 text-right grid items-center"
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
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" formAction={formAction} disabled={isPending}>
              {isPending && <ButtonSpinner />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
