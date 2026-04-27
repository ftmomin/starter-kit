# STARTER KIT

A web application built with Next.js 16, Better-auth(Org), Drizzle ORM, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 🛠️ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (running locally or via Docker)

## 🏁 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd HMS_Drizzle
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Setup

Copy the example environment file to create your local configuration:

```bash
cp .env.example .env
```

Open `.env` and fill in your specific values:

- `DATABASE_URL`: Your PostgreSQL connection string.
- `BETTER_AUTH_SECRET`: Generate a random secret.
- `IMAGEKIT_*`: Your ImageKit credentials (if using image uploads).

### 4. Database Setup

Push the schema to your database:

```bash
pnpm run db:push
```

(Optional) Seed the database:

```bash
pnpm run db:seed
```

### 5. Run the Application

Start the development server:

```bash
pnpm run dev
```

The app will be available at [http://localhost:5000](http://localhost:5000).

## 📜 Scripts

- `pnpm run dev`: Start the dev server on port 5000.
- `pnpm run build`: Build the application for production.
- `pnpm run start`: Start the production server.
- `pnpm run lint`: Run ESLint.
- `pnpm run tsc`: Run TypeScript type checking.
- `pnpm run db:generate`: Generate SQL migrations from Drizzle schema.
- `pnpm run db:migrate`: Apply migrations.
- `pnpm run db:push`: Push schema changes directly to DB (prototyping).
- `pnpm run db:studio`: Open Drizzle Studio to view data.

## 📂 Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components.
- `drizzle/`: Database schema, migrations, and seed scripts.
- `lib/`: Core libraries and configuration (auth, etc.).
- `utils/`: Helper functions.
- `public/`: Static assets.
