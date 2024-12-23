#!/usr/bin/env node
import { Command } from 'commander';

import { testConnection } from '../config';
import { seedDatabase } from '../seed';

const program = new Command();

program
  .name('seed-db')
  .description('Seed the database with test data')
  .requiredOption('-u, --user-id <id>', 'User ID to associate with seeded data')
  .option('-o, --org-id <id>', 'Organization ID to associate with seeded data')
  .action(async options => {
    try {
      // Test database connection first
      const isConnected = await testConnection();

      if (!isConnected) {
        console.error(
          'Could not connect to database. Please check your configuration.',
        );
        process.exit(1);
      }

      await seedDatabase(options.userId, options.orgId || null);

      process.exit(0);
    } catch (error) {
      console.error('Seeding failed:', error);

      process.exit(1);
    }
  });

program.parse();
