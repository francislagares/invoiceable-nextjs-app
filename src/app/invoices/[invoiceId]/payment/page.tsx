import { notFound } from 'next/navigation';

import { eq } from 'drizzle-orm';
import { Check, CreditCard } from 'lucide-react';
import Stripe from 'stripe';

import Container from '@/components/Container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { createPayment, updateInvoiceStatus } from '@/app/actions';
import { db } from '@/drizzle';
import { Customer, Invoice } from '@/drizzle/schema';
import { cn } from '@/lib/utils';

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET_KEY));

interface StripePaymentProps {
  params: { invoiceId: string };
  searchParams: {
    status: string;
    session_id: string;
  };
}

const StripePayment = async ({ params, searchParams }: StripePaymentProps) => {
  const invoiceId = Number.parseInt(params.invoiceId);

  const sessionId = searchParams.session_id;
  const isSuccess = sessionId && searchParams.status === 'success';
  const isCanceled = searchParams.status === 'canceled';
  let isError = isSuccess && !sessionId;

  console.log('isSuccess', isSuccess);
  console.log('isCanceled', isCanceled);

  if (Number.isNaN(invoiceId)) {
    throw new Error('Invalid Invoice ID');
  }

  if (isSuccess) {
    const { payment_status } =
      await stripe.checkout.sessions.retrieve(sessionId);

    if (payment_status !== 'paid') {
      isError = true;
    } else {
      const formData = new FormData();
      formData.append('id', String(invoiceId));
      formData.append('status', 'paid');

      await updateInvoiceStatus(formData);
    }
  }

  const [result] = await db
    .select({
      id: Invoice.id,
      status: Invoice.status,
      createTs: Invoice.createTs,
      description: Invoice.description,
      value: Invoice.value,
      name: Customer.name,
    })
    .from(Invoice)
    .innerJoin(Customer, eq(Invoice.customerId, Customer.id))
    .where(eq(Invoice.id, invoiceId))
    .limit(1);

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result,
    customer: {
      name: result.name,
    },
  };

  return (
    <main className='h-full w-full'>
      <Container>
        {isError && (
          <p className='mb-6 rounded-lg bg-red-100 px-3 py-2 text-center text-sm text-red-800'>
            Something went wrong, please try again!
          </p>
        )}
        {isCanceled && (
          <p className='mb-6 rounded-lg bg-yellow-100 px-3 py-2 text-center text-sm text-yellow-800'>
            Payment was canceled, please try again.
          </p>
        )}
        <div className='grid grid-cols-2'>
          <div>
            <div className='mb-8 flex justify-between'>
              <h1 className='flex items-center gap-4 text-3xl font-semibold'>
                Invoice {invoice.id}
                <Badge
                  className={cn(
                    'rounded-full capitalize',
                    invoice.status === 'open' && 'bg-blue-500',
                    invoice.status === 'paid' && 'bg-green-600',
                    invoice.status === 'void' && 'bg-zinc-700',
                    invoice.status === 'uncollectible' && 'bg-red-600',
                  )}
                >
                  {invoice.status}
                </Badge>
              </h1>
            </div>

            <p className='mb-3 text-3xl'>${(invoice.value / 100).toFixed(2)}</p>

            <p className='mb-8 text-lg'>{invoice.description}</p>
          </div>
          <div>
            <h2 className='mb-4 text-xl font-bold'>Manage Invoice</h2>
            {invoice.status === 'open' && (
              <form action={createPayment}>
                <input type='hidden' name='id' value={invoice.id} />
                <Button className='flex gap-2 bg-green-700 font-bold'>
                  <CreditCard className='h-auto w-5' />
                  Pay Invoice
                </Button>
              </form>
            )}
            {invoice.status === 'paid' && (
              <p className='flex items-center gap-2 text-xl font-bold'>
                <Check className='h-auto w-8 rounded-full bg-green-500 p-1 text-white' />
                Invoice Paid
              </p>
            )}
          </div>
        </div>

        <h2 className='mb-4 text-lg font-bold'>Billing Details</h2>

        <ul className='grid gap-2'>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 text-sm font-medium'>
              Invoice ID
            </strong>
            <span>{invoice.id}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 text-sm font-medium'>
              Invoice Date
            </strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 text-sm font-medium'>
              Billing Name
            </strong>
            <span>{invoice.customer.name}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
};

export default StripePayment;
