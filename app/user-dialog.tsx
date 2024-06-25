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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ButtonSpinner } from '@/components/icons';

function SubmitButton({
  formAction,
  setOpen,
  state
}: {
  formAction: (formData: FormData) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  state: FormState;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      formAction={formAction}
      onClick={() => {
        if (!pending && state.status === 'success') setOpen(false);
      }}
      disabled={pending}
    >
      {pending && <ButtonSpinner />}
      Save changes
    </Button>
  );
}

const initialState: FormState = {
  message: '',
  status: 'idle'
};

export function UserDialog({ user }: { user?: SelectUser }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(
    user ? updateUser.bind(null, user) : addUser,
    initialState
  );

  if (state?.status === 'success') {
    formRef?.current?.reset();

    // HACK to reset state after successful submission
    state.status = 'idle';
    state.message = '';
    state.errors = undefined;
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
        <form ref={formRef}>
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
                //   type="email"
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
            <SubmitButton
              formAction={formAction}
              setOpen={setOpen}
              state={state}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
