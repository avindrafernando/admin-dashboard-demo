<div align="center"><strong>Next.js 16 Admin Dashboard</strong></div>
<div align="center">Built with the Next.js App Router</div>
<br />
<div align="center">
<a href="https://next-admin-dash.vercel.app/">Demo</a>
<span> · </span>
<a href="https://vercel.com/templates/next.js/admin-dashboard-tailwind-postgres-react-nextjs">Clone & Deploy</a>
<span>
</div>

This project is based on Vercel's MIT-licensed [Next.js admin dashboard template](https://vercel.com/templates/next.js/admin-dashboard-tailwind-postgres-react-nextjs). See `LICENSE.md`.

## Overview

This is a starter template using the following stack:

- Framework - [Next.js 16](https://nextjs.org/)
- UI - [React 19](https://react.dev)
- Language - [TypeScript](https://www.typescriptlang.org)
- Auth - [Auth.js / NextAuth](https://authjs.dev) with GitHub
- Database - [Postgres](https://vercel.com/postgres) via [Drizzle ORM](https://orm.drizzle.team) and [Neon](https://neon.tech)
- Validation - [Zod 3](https://zod.dev)
- Deployment - [Vercel](https://vercel.com/docs/concepts/next.js/overview)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- Components - [Shadcn UI](https://ui.shadcn.com/)
- Analytics - [Vercel Analytics](https://vercel.com/analytics)
- Formatting - [Prettier](https://prettier.io)

This template uses the Next.js App Router. This includes support for enhanced layouts, colocation of components, tests, and styles, component-level data fetching, and more.

## Getting Started

During the deployment, Vercel will prompt you to create a new Postgres database. This will add the necessary environment variables to your project.

Inside the Vercel Postgres dashboard, create a table based on the schema defined in `lib/db.ts`.

```
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50),
  email VARCHAR(50),
  username VARCHAR(50)
);
```

Insert a row for testing:

```
INSERT INTO users (email, name, username) VALUES ('me@site.com', 'Me', 'username');
```

Copy the `.env.example` file to `.env` and update the values.

`AUTH_GITHUB_ALLOWLIST` is a comma-separated list of GitHub logins that may sign in. Anyone else who completes GitHub OAuth is rejected with an access-denied page. Leave it empty to reject every sign-in. Do not commit real logins.

Finally, run the following commands to start the development server:

```
pnpm install
pnpm dev
```

You should now be able to access the application at http://localhost:4000.
