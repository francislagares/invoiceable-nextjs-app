'use server';

import { redirect } from 'next/navigation';

import { db } from '@/drizzle';
import { Invoice } from '@/drizzle/schema';

export const createInvoice = async (formData: FormData) => {
  const value = Math.floor(parseFloat(String(formData.get('value'))));
  const description = String(formData.get('description'));

  const data = await db
    .insert(Invoice)
    .values({
      value,
      description,
      status: 'open',
    })
    .returning({
      id: Invoice.id,
    });

  redirect(`/invoices/${data[0].id}`);
};
