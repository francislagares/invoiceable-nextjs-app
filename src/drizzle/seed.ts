import { faker } from '@faker-js/faker';
import chalk from 'chalk';
import { eq } from 'drizzle-orm';

import { Customer, Invoice, Status } from './schema';

import { db } from './index';

const BATCH_SIZE = 50;
const TOTAL_RECORDS = 300;

// Possible invoice statuses with weighted distribution
const WEIGHTED_STATUSES: Status[] = [
  'open',
  'open',
  'open', // 30% open
  'paid',
  'paid',
  'paid',
  'paid', // 40% paid
  'void', // 10% void
  'uncollectible',
  'uncollectible', // 20% uncollectible
];

interface SeedCustomer {
  id: number;
  userId: string;
  organizationId: string | null;
}

async function cleanupDatabase() {
  console.log(chalk.yellow('🧹 Cleaning up existing data...'));

  try {
    await db.delete(Invoice);
    await db.delete(Customer);

    console.log(chalk.green('✓ Database cleaned successfully'));
  } catch (error) {
    console.error(chalk.red('Failed to clean database:'), error);

    throw error;
  }
}

function generateCustomerData(
  userId: string,
  organizationId: string | null,
): Omit<typeof Customer.$inferInsert, 'id'> {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    userId,
    organizationId,
    createTs: faker.date.past({ years: 2 }),
  };
}

function generateInvoiceData(
  customerId: number,
  userId: string,
  organizationId: string | null,
): typeof Invoice.$inferInsert {
  // Generate realistic invoice values between $10 and $10,000
  const value = Math.floor(faker.number.float({ min: 10, max: 10000 }) * 100);

  // Create descriptions
  const services = [
    'Web Development',
    'UI/UX Design',
    'Consulting Services',
    'Technical Support',
    'Content Creation',
    'Digital Marketing',
    'System Maintenance',
    'Training Session',
  ];

  const service = faker.helpers.arrayElement(services);
  const description = faker.helpers.arrayElement([
    `${service} - ${faker.date.month()} Project`,
    `${service} - Phase ${faker.number.int({ min: 1, max: 5 })}`,
    `${service} - ${faker.number.int({ min: 1, max: 40 })} hours`,
    `${service} - Monthly Retainer`,
  ]);

  return {
    value,
    description,
    userId,
    organizationId,
    customerId,
    status: faker.helpers.arrayElement(WEIGHTED_STATUSES),
    createTs: faker.date.past({ years: 1 }),
  };
}

async function seedBatch(
  batchNumber: number,
  userId: string,
  organizationId: string | null,
): Promise<SeedCustomer[]> {
  const batchStart = (batchNumber - 1) * BATCH_SIZE;
  console.log(
    chalk.blue(
      `\n📦 Processing batch ${batchNumber} (records ${batchStart + 1}-${batchStart + BATCH_SIZE})`,
    ),
  );

  try {
    // Create customers for this batch
    const customerData = Array.from({ length: BATCH_SIZE }, () =>
      generateCustomerData(userId, organizationId),
    );

    const customers = await db.insert(Customer).values(customerData).returning({
      id: Customer.id,
      userId: Customer.userId,
      organizationId: Customer.organizationId,
    });

    // Create 1-3 invoices per customer
    for (const customer of customers) {
      const invoiceCount = faker.number.int({ min: 1, max: 3 });
      const invoices = Array.from({ length: invoiceCount }, () =>
        generateInvoiceData(customer.id, userId, organizationId),
      );

      await db.insert(Invoice).values(invoices);
    }

    console.log(chalk.green(`✓ Batch ${batchNumber} completed successfully`));

    return customers;
  } catch (error) {
    console.error(chalk.red(`Failed to seed batch ${batchNumber}:`), error);

    throw error;
  }
}

export async function seedDatabase(
  userId: string,
  organizationId: string | null = null,
) {
  console.log(chalk.cyan('\n🌱 Starting database seeding process...'));
  console.log(chalk.gray(`Target: ${TOTAL_RECORDS} records`));

  try {
    // Clean existing data
    await cleanupDatabase();

    const batches = Math.ceil(TOTAL_RECORDS / BATCH_SIZE);
    const allCustomers: SeedCustomer[] = [];

    // Process in batches to avoid memory issues
    for (let batch = 1; batch <= batches; batch++) {
      const customers = await seedBatch(batch, userId, organizationId);

      allCustomers.push(...customers);
    }

    // Verify seeded data
    const customerCount = await db
      .select({ count: Customer.id })
      .from(Customer)
      .where(eq(Customer.userId, userId));

    const invoiceCount = await db
      .select({ count: Invoice.id })
      .from(Invoice)
      .where(eq(Invoice.userId, userId));

    console.log(chalk.green('\n✨ Seeding completed successfully!'));
    console.log(chalk.gray(`Created ${customerCount[0].count} customers`));
    console.log(chalk.gray(`Created ${invoiceCount[0].count} invoices`));
  } catch (error) {
    console.error(chalk.red('\n❌ Seeding failed:'), error);

    await cleanupDatabase();

    throw error;
  }
}
