import Link from 'next/link';

import { CirclePlus } from 'lucide-react';

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
import { Invoice } from '@/drizzle/schema';

const Dashboard = async () => {
  const data = await db.select().from(Invoice);
  console.log(data);
  return (
    <main className='mx-auto my-12 flex h-full max-w-5xl flex-col justify-center gap-6 text-center'>
      <div className='flex justify-between'>
        <h1 className='text-left text-3xl font-bold'>Invoices</h1>
        <div>
          <Button className='inline-flex gap-2' variant='ghost' asChild>
            <Link href='/invoices/create'>
              <CirclePlus className='h-4 w-4' />
              Create Invoice
            </Link>
          </Button>
        </div>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px] p-4'>Date</TableHead>
            <TableHead className='p-4'>Customer</TableHead>
            <TableHead className='p-4'>Email</TableHead>
            <TableHead className='p-4'>Status</TableHead>
            <TableHead className='p-4 text-right'>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(invoice => (
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
                  {invoice.status}
                </Link>
              </TableCell>
              <TableCell className='p-0 text-left'>
                <Link href={`/invoices/${invoice.id}`} className='p-4'>
                  emailaddress@gmail
                </Link>
              </TableCell>
              <TableCell className='p-0 text-left'>
                <Badge className='rounded-full'>Badge</Badge>
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
          ))}
        </TableBody>
      </Table>
    </main>
  );
};

export default Dashboard;
