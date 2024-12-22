import { eq } from 'drizzle-orm';

import { db } from '@/drizzle';
import { Invoice } from '@/drizzle/schema';

const InvoiceDetail = async ({ params }: { params: { invoiceId: string } }) => {
  const invoiceId = parseInt(params.invoiceId);

  const [invoice] = await db
    .select()
    .from(Invoice)
    .where(eq(Invoice.id, invoiceId))
    .limit(1);

  console.log('result', invoice);

  return (
    <main className='mx-auto my-12 flex h-full max-w-5xl flex-col justify-center gap-6 text-center'>
      <div className='flex justify-between'>
        <h1 className='text-left text-3xl font-bold'>Invoice {invoiceId}</h1>
        <div></div>
      </div>
    </main>
  );
};

export default InvoiceDetail;
