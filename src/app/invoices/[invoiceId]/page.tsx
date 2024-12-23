import { notFound } from 'next/navigation';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

import { db } from '@/drizzle';
import { Customer, Invoice } from '@/drizzle/schema';

import InvoiceDetail from './components/Invoice';

const InvoicePage = async ({ params }: { params: { invoiceId: string } }) => {
  const { userId } = await auth();

  if (!userId) return;

  const invoiceId = Number.parseInt(params.invoiceId);

  if (Number.isNaN(invoiceId)) {
    throw new Error('Invalid Invoice ID');
  }

  const [invoiceData]: Array<{
    invoice: typeof Invoice.$inferSelect;
    customer: typeof Customer.$inferSelect;
  }> = await db
    .select()
    .from(Invoice)
    .innerJoin(Customer, eq(Invoice.customerId, Customer.id))
    .limit(1);

  if (!invoiceData) {
    notFound();
  }

  const invoice = {
    ...invoiceData.invoice,
    customer: invoiceData.customer,
  };

  return <InvoiceDetail invoice={invoice} />;
};

export default InvoicePage;
