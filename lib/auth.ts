import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import type { Session } from 'next-auth';

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

function sessionGithubLogin(session: Session | null): string | null {
  const login = session?.user?.login;
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
      const login = githubLogin(profile);
      if (!login) {
        return false;
      }

      return githubAllowlist().includes(login);
    },
    async jwt({ token, profile }) {
      const login = githubLogin(profile);
      if (login) {
        token.login = login;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.login === 'string') {
        session.user.login = token.login;
      }

      return session;
    }
  }
});

export async function getSession(): Promise<Session | null> {
  return (await auth()) ?? null;
}

export function sessionCanWrite(session: Session | null): boolean {
  const login = sessionGithubLogin(session);
  if (!login) {
    return false;
  }

  return githubAllowlist().includes(login);
}
