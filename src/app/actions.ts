'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs/server';
import { and, eq, isNull } from 'drizzle-orm';
import Stripe from 'stripe';

import { db } from '@/drizzle';
import { Customer, Invoice, Status } from '@/drizzle/schema';

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET_KEY));

export const createInvoice = async (formData: FormData) => {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  const value = Math.floor(
    Number.parseFloat(String(formData.get('value'))) * 100,
  );
  const description = formData.get('description') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  const [customer] = await db
    .insert(Customer)
    .values({
      name,
      email,
      userId,
      organizationId: orgId || null,
    })
    .returning({
      id: Customer.id,
    });

  const invoice = await db
    .insert(Invoice)
    .values({
      value,
      description,
      userId,
      customerId: customer.id,
      status: 'open',
      organizationId: orgId || null,
    })
    .returning({
      id: Invoice.id,
    });

  redirect(`/invoices/${invoice[0].id}`);
};

export const updateInvoiceStatus = async (formData: FormData) => {
  const { userId, orgId } = await auth();

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

export const createPayment = async (formData: FormData) => {
  const headersList = await headers();
  const origin = headersList.get('origin');
  const id = Number.parseInt(formData.get('id') as string);

  const [result] = await db
    .select({
      status: Invoice.status,
      value: Invoice.value,
    })
    .from(Invoice)
    .where(eq(Invoice.id, id))
    .limit(1);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product: 'prod_RS7eqGqSM8ffyX',
          unit_amount: result.value,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) {
    throw new Error('Invalid Session');
  }

  redirect(session.url);
};
