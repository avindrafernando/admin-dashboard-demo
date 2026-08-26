'use client';

import { Input } from '@/components/ui/input';
import { SearchIcon, Spinner } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useTransition, useEffect, useRef, useState } from 'react';

export function Search(props: { value?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(props.value);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (value === undefined) {
      return;
    } else if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }

    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }, [router, value]);

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={value ?? ''}
        onInput={(e) => {
          setValue(e.currentTarget.value);
        }}
        spellCheck={false}
        className="w-full appearance-none bg-card pl-9"
        placeholder="Search users..."
      />
      {isPending && <Spinner />}
    </div>
  );
}
