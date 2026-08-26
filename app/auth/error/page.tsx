import Link from 'next/link';
import { Button } from '@/components/ui/button';

const messages: Record<string, string> = {
  AccessDenied:
    'This GitHub account is not allowed to sign in to this demo.',
  Configuration: 'Sign in is not configured correctly.',
  Verification: 'The sign-in link is invalid or has expired.',
  Default: 'Sign in failed. Try again, or use an allowed GitHub account.'
};

export default async function AuthErrorPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = messages[error ?? ''] ?? messages.Default;

  return (
    <main className="flex flex-1 flex-col items-start gap-3 p-6 md:p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in blocked</h1>
      <p className="max-w-xl text-sm text-muted-foreground">{message}</p>
      <Button asChild variant="outline">
        <Link href="/">Back to users</Link>
      </Button>
    </main>
  );
}
