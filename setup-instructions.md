# Setup Instructions

## Database Setup

1. **Create NeonDB Account**: Go to https://neon.tech and create a free account

2. **Create Database**: Create a new database project named `brain_mri_app`

3. **Get Connection String**: Copy your connection string from NeonDB dashboard

4. **Update Environment**: Replace the DATABASE_URL in `.env.local` with your actual connection string

5. **Run Migrations**: 
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Generate Client**:
   ```bash
   npx prisma generate
   ```

## Test Database Connection

Visit `/api/test-db` to verify database connection is working

## Common Issues

- **Internal Server Error**: Usually means DATABASE_URL is incorrect or database tables don't exist
- **Connection Failed**: Check your NeonDB connection string and network access
- **Prisma Client Error**: Run `npx prisma generate` to regenerate client

## Environment Variables Required

```
DATABASE_URL="your-neon-db-connection-string"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
