import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

function githubAllowlist(): string[] {
  return (process.env.AUTH_GITHUB_ALLOWLIST ?? '')
    .split(',')
    .map((login) => login.trim().toLowerCase())
    .filter(Boolean);
}

function githubLogin(profile: unknown): string | null {
  if (!profile || typeof profile !== 'object' || !('login' in profile)) {
    return null;
  }

  const login = (profile as { login: unknown }).login;
  return typeof login === 'string' ? login.toLowerCase() : null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  trustHost: true,
  pages: {
    error: '/auth/error'
  },
  callbacks: {
    async signIn({ profile }) {
      const allowed = githubAllowlist();
      if (allowed.length === 0) {
        return false;
      }

      const login = githubLogin(profile);
      if (!login) {
        return false;
      }

      return allowed.includes(login);
    }
  }
});

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be signed in to do that');
  }

  return session;
}
