import { notFound } from 'next/navigation';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

import { db } from '@/drizzle';
import { Invoice } from '@/drizzle/schema';

import InvoiceDetail from './components/Invoice';

const InvoicePage = async ({ params }: { params: { invoiceId: string } }) => {
  const { userId } = await auth();

  if (!userId) return;

  const invoiceId = Number.parseInt(params.invoiceId);

  if (Number.isNaN(invoiceId)) {
    throw new Error('Invalid Invoice ID');
  }

  const [data] = await db
    .select()
    .from(Invoice)
    .where(eq(Invoice.id, invoiceId))
    .limit(1);

  console.log('result', data);

  if (!data) {
    notFound();
  }

  const invoice = {
    ...data.invoices,
    customer: data.customers,
  };

  return <InvoiceDetail invoice={invoice} />;
};

export default InvoicePage;
