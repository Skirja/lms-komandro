# LMS Komandro

Learning Management System for Komandro built with Next.js and Prisma.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/lms-komandro.git
cd lms-komandro
```

2. Install dependencies:
```bash
npm install
```

## Configuration

1. Create a `.env` file in the project root:
```bash
# Create and open .env file
cp .env.example .env
```

2. Add the following environment variables to your `.env` file:
```plaintext
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key-here"
```

## Database Setup

1. Generate Prisma Client and create database:
```bash
npx prisma generate
npx prisma db push
```

2. Seed the database with initial data:
```bash
npm run db:seed
```

## Running the Project

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Default admin credentials:
- Email: admin@komandro.com
- Password: komandro@admin

## Project Structure

```
lms-komandro/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utility functions and services
├── prisma/                # Prisma schema and migrations
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
└── scripts/               # Setup and utility scripts
```

## Common Issues & Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Ensure your `.env` file exists and contains the correct DATABASE_URL
2. Try removing the existing database and regenerating:
```bash
rm -rf prisma/dev.db
rm -rf prisma/dev.db-journal
npx prisma generate
npx prisma db push
npm run db:seed
```

3. If Prisma client issues persist:
```bash
rm -rf node_modules/.prisma
npm install
npx prisma generate
```

### Permission Errors

If you encounter EPERM (permission) errors:

1. Close any applications that might be using the database
2. Run commands with administrator privileges
3. Check file permissions in the project directory


## Author

Created by Muhammad Irza Arifin (Skirja)

