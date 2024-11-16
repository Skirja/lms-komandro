# Komandro LMS (Learning Management System)

A modern learning management system built with Next.js 13+, featuring role-based access control and project management capabilities.

## Features

- 🔐 Role-based access control (Admin and Student)
- 📊 Admin dashboard with user and project management
- 📝 Project submission and tracking
- 📈 Analytics and progress tracking
- 🎨 Modern UI with Shadcn/ui components
- 🔄 Real-time notifications with Sonner

## Tech Stack

- **Framework**: Next.js 13+
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Hooks
- **Type Safety**: TypeScript

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/lms-komandro.git
cd lms-komandro
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
# Create a .env file and add:
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations and seed the database
npx prisma migrate reset --force

npx prisma db push

npx prisma db seed
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Default Admin Account

After seeding the database, you can log in with these credentials:
- Email: admin@komandro.com
- Password: komandro@admin

## Project Structure

```
lms-komandro/
├── app/                    # App router pages and API routes
├── components/            # Reusable components
│   ├── admin/            # Admin dashboard components
│   └── ui/               # UI components
├── lib/                  # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── scripts/              # Database seed and other scripts
```

## Features in Development

- [ ] Advanced project filtering and search
- [ ] Detailed submission management
- [ ] User profile management
- [ ] Advanced reporting features
- [ ] Email notifications