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
import { cn } from '@/lib/utils';

export default async function Home() {
  const { userId, orgId } = auth();

  if (!userId) return;

  const invoices = results?.map(({ invoices, customers }) => {
    return {
      ...invoices,
      customer: customers,
    };
  });

  return (
    <main className='h-full'>
      <Container>
        <p className='mb-6 rounded-lg bg-yellow-100 px-3 py-2 text-center text-sm text-yellow-800'>
          Displaying all invoices for public demo. Creation is disabled.
        </p>
        <div className='mb-6 flex justify-between'>
          <h1 className='text-3xl font-semibold'>Invoices</h1>
          <p>
            <Button className='inline-flex gap-2' variant='ghost' asChild>
              <Link href='/invoices/new'>
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
            {invoices.map(result => {
              return (
                <TableRow key={result.id}>
                  <TableCell className='p-0 text-left font-medium'>
                    <Link
                      href={`/invoices/${result.id}`}
                      className='block p-4 font-semibold'
                    >
                      {new Date(result.createTs).toLocaleDateString()}
                    </Link>
                  </TableCell>
                  <TableCell className='p-0 text-left'>
                    <Link
                      href={`/invoices/${result.id}`}
                      className='block p-4 font-semibold'
                    >
                      {result.customer.name}
                    </Link>
                  </TableCell>
                  <TableCell className='p-0 text-left'>
                    <Link className='block p-4' href={`/invoices/${result.id}`}>
                      {result.customer.email}
                    </Link>
                  </TableCell>
                  <TableCell className='p-0 text-center'>
                    <Link className='block p-4' href={`/invoices/${result.id}`}>
                      <Badge
                        className={cn(
                          'rounded-full capitalize',
                          result.status === 'open' && 'bg-blue-500',
                          result.status === 'paid' && 'bg-green-600',
                          result.status === 'void' && 'bg-zinc-700',
                          result.status === 'uncollectible' && 'bg-red-600',
                        )}
                      >
                        {result.status}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className='p-0 text-right'>
                    <Link
                      href={`/invoices/${result.id}`}
                      className='block p-4 font-semibold'
                    >
                      ${(result.value / 100).toFixed(2)}
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
