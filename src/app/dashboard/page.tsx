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

const Dashboard = () => {
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
          <TableRow>
            <TableCell className='p-4 text-left font-medium'>
              <span className='font-semibold'>INV001</span>
            </TableCell>
            <TableCell className='p-4 text-left'>
              <span className='font-semibold'>Paid</span>
            </TableCell>
            <TableCell className='p-4 text-left'>
              <span>emailaddress@gmail.com</span>
            </TableCell>
            <TableCell className='p-4 text-left'>
              <Badge className='rounded-full'>Badge</Badge>
            </TableCell>
            <TableCell className='p-4 text-right'>
              <span className='font-semibold'> $250.00</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
};

export default Dashboard;
