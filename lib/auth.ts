import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

function githubAllowlist(): string[] {
  return (process.env.AUTH_GITHUB_ALLOWLIST ?? '')
    .split(',')
    .map((login) => login.trim())
    .filter(Boolean);
}

function githubLogin(profile: unknown): string | null {
  if (!profile || typeof profile !== 'object' || !('login' in profile)) {
    return null;
  }

  const login = (profile as { login: unknown }).login;
  return typeof login === 'string' ? login : null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
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
    }
  }
});
