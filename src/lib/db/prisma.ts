import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // In production, create client with adapter if DATABASE_URL is available
  if (process.env.DATABASE_URL) {
    const connectionString = process.env.DATABASE_URL;
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } else {
    // Fallback for build time when DATABASE_URL might not be available
    // Use an empty configuration object to satisfy the requirement
    prisma = new PrismaClient({} as any);
  }
} else {
  // In development, use a global variable to prevent hot reloading issues
  if (!global.prisma) {
    if (process.env.DATABASE_URL) {
      const connectionString = process.env.DATABASE_URL;
      const pool = new pg.Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      global.prisma = new PrismaClient({ adapter });
    } else {
      // Fallback for build time
      global.prisma = new PrismaClient({} as any);
    }
  }
  prisma = global.prisma;
}

export default prisma;