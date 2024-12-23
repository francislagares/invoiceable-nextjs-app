'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs/server';
import { and, eq, isNull } from 'drizzle-orm';

import { db } from '@/drizzle';
import { Invoice, Status } from '@/drizzle/schema';

export const createInvoice = async (formData: FormData) => {
  const { userId } = await auth();
  const value = Math.floor(parseFloat(String(formData.get('value'))));
  const description = String(formData.get('description'));

  if (!userId) {
    return;
  }

  const data = await db
    .insert(Invoice)
    .values({
      value,
      description,
      userId,
      status: 'open',
    })
    .returning({
      id: Invoice.id,
    });

  redirect(`/invoices/${data[0].id}`);
};

export const updateInvoiceStatus = async (formData: FormData) => {
  const { userId, orgId } = await auth();

  // Updating disabled for demo
  if (userId !== process.env.ME_ID) return;

  if (!userId) {
    return;
  }

  const id = formData.get('id') as string;
  const status = formData.get('status') as Status;

  if (orgId) {
    await db
      .update(Invoice)
      .set({ status })
      .where(
        and(
          eq(Invoice.id, Number.parseInt(id)),
          eq(Invoice.organizationId, orgId),
        ),
      );
  } else {
    await db
      .update(Invoice)
      .set({ status })
      .where(
        and(
          eq(Invoice.id, Number.parseInt(id)),
          eq(Invoice.userId, userId),
          isNull(Invoice.organizationId),
        ),
      );
  }

  revalidatePath(`/invoices/${id}`, 'page');
};

export const deleteInvoice = async (formData: FormData) => {
  const { userId, orgId } = await auth();

  // Deleting disabled for demo
  if (userId !== process.env.ME_ID) return;

  if (!userId) {
    return;
  }

  const id = formData.get('id') as string;

  if (orgId) {
    await db
      .delete(Invoice)
      .where(
        and(
          eq(Invoice.id, Number.parseInt(id)),
          eq(Invoice.organizationId, orgId),
        ),
      );
  } else {
    await db
      .delete(Invoice)
      .where(
        and(
          eq(Invoice.id, Number.parseInt(id)),
          eq(Invoice.userId, userId),
          isNull(Invoice.organizationId),
        ),
      );
  }

  redirect('/dashboard');
};
