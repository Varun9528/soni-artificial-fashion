// Mock Prisma client for development
// This will be replaced with real Prisma when database is properly set up

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
export { prisma };
