import Link from 'next/link';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { CirclePlus } from 'lucide-react';

import Container from '@/components/Container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { db } from '@/drizzle';
import { Customer, Invoice } from '@/drizzle/schema';
import { cn } from '@/lib/utils';

export default async function Home() {
  const { userId } = await auth();

  if (!userId) return;

  const data: Array<{
    invoice: typeof Invoice.$inferSelect;
    customer: typeof Customer.$inferSelect;
  }> = await db
    .select()
    .from(Invoice)
    .innerJoin(Customer, eq(Invoice.customerId, Customer.id));

  const invoices = data?.map(({ invoice, customer }) => {
    return {
      ...invoice,
      customer,
    };
  });

  return (
    <main className='h-full'>
      <Container>
        <div className='mb-6 flex justify-between'>
          <h1 className='text-3xl font-semibold'>Invoices</h1>
          <p>
            <Button className='inline-flex gap-2' variant='ghost' asChild>
              <Link href='/invoices/create'>
                <CirclePlus className='h-4 w-4' />
                Create Invoice
              </Link>
            </Button>
          </p>
        </div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px] p-4'>Date</TableHead>
              <TableHead className='p-4'>Customer</TableHead>
              <TableHead className='p-4'>Email</TableHead>
              <TableHead className='p-4 text-center'>Status</TableHead>
              <TableHead className='p-4 text-right'>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map(invoice => {
              return (
                <TableRow key={invoice.id}>
                  <TableCell className='p-0 text-left font-medium'>
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className='block p-4 font-semibold'
                    >
                      {new Date(invoice.createTs).toLocaleDateString()}
                    </Link>
                  </TableCell>
                  <TableCell className='p-0 text-left'>
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className='block p-4 font-semibold'
                    >
                      {invoice.customer.name}
                    </Link>
                  </TableCell>
                  <TableCell className='p-0 text-left'>
                    <Link
                      className='block p-4'
                      href={`/invoices/${invoice.id}`}
                    >
                      {invoice.customer.email}
                    </Link>
                  </TableCell>
                  <TableCell className='p-0 text-center'>
                    <Link
                      className='block p-4'
                      href={`/invoices/${invoice.id}`}
                    >
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
                    </Link>
                  </TableCell>
                  <TableCell className='p-0 text-right'>
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className='block p-4 font-semibold'
                    >
                      ${(invoice.value / 100).toFixed(2)}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Container>
    </main>
  );
}
