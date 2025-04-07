# Data Annotation Platform

A modern web application for text annotation, allowing users to create projects, manage datasets, and annotate content with a user-friendly interface.

## Features

- **Project Management**: Create and manage annotation projects
- **Dataset Handling**: Import and organize text datasets
- **Annotation Interface**: Intuitive interface for annotating text
- **User Management**: Role-based access control (Admin, Manager, Annotator)
- **Authentication**: Secure login with email/password

## Prerequisites

- Node.js 18 or later
- pnpm (will be installed automatically if not present)

## Setup Instructions

### Windows

1. Install Node.js from [https://nodejs.org/](https://nodejs.org/) if you don't have it already
2. Run the setup script:
   ```
   setup-windows.bat
   ```
3. Follow the prompts to complete the setup

### Manual Setup

1. Install dependencies:
   ```
   pnpm install
   ```

2. Create a `.env` file with the following content:
   ```
   # Database - Using SQLite for local development
   DATABASE_URL="file:./dev.db"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="development-secret-key-change-in-production"
   ```

3. Set up the database:
   ```
   pnpm prisma generate
   pnpm prisma db push
   ```

4. Build the project:
   ```
   pnpm build
   ```

## Running the Application

Start the development server:
```
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Development Notes

- For development purposes, the application uses SQLite instead of PostgreSQL
- Authentication is simplified with email/password instead of Keycloak
- Any email and password combination will create a new user account

## Project Structure

- `/app`: Next.js application routes and API endpoints
- `/components`: Reusable UI components
- `/lib`: Utility functions and shared code
- `/prisma`: Database schema and migrations
- `/public`: Static assets
- `/styles`: Global styles and Tailwind configuration

## License

MIT 