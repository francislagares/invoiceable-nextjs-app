'use client';

import { SyntheticEvent, useState } from 'react';

import Form from 'next/form';

import Container from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { createInvoice } from '@/app/actions';

const Invoice = () => {
  const [state, setState] = useState('ready');

  const handleSubmit = async (event: SyntheticEvent) => {
    if (state === 'pending') {
      event.preventDefault();

      return;
    }
    setState('pending');
  };

  return (
    <main className='h-full'>
      <Container>
        <div className='flex justify-between'>
          <h1 className='text-left text-3xl font-bold'>Create Invoice</h1>
        </div>

        <Form
          action={createInvoice}
          onSubmit={handleSubmit}
          className='grid max-w-xs gap-4'
        >
          <div>
            <Label htmlFor='name' className='mb-2 block text-sm font-semibold'>
              Billing Name
            </Label>
            <Input id='name' name='name' type='text' />
          </div>

          <div>
            <Label htmlFor='email' className='mb-2 block text-sm font-semibold'>
              Billing Email
            </Label>
            <Input id='email' name='email' type='email' />
          </div>

          <div>
            <Label htmlFor='value' className='mb-2 block text-sm font-semibold'>
              Value
            </Label>
            <Input id='value' name='value' type='text' />
          </div>

          <div>
            <Label
              htmlFor='description'
              className='mb-2 block text-sm font-semibold'
            >
              Description
            </Label>
            <Textarea id='description' name='description' />
          </div>
          <SubmitButton />
        </Form>
      </Container>
    </main>
  );
};

export default Invoice;
