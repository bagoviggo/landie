'use server';
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { signOut } from '@/auth';
import { prisma } from '@/app/lib/prisma';
import * as bcrypt from 'bcrypt';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
 
export async function logout() {
  await signOut();
}

export async function signup(
  prevState: string | undefined,
  formData: FormData,
) {
  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
    role: z.enum(['tenant', 'landlord']).default('tenant'),
  });

  const validatedFields = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    phone: formData.get('phone') || undefined,
    role: formData.get('role') || 'tenant',
  });

  if (!validatedFields.success) {
    return validatedFields.error.issues[0].message;
  }

  const { name, email, password, phone, role } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return 'An account with this email already exists.';

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, hashedPassword, phone: phone || null, role },
    });

    if (role === 'landlord') {
      await prisma.landlord.create({
        data: { userId: user.id, companyName: '' },
      });
    }

    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Account created but sign-in failed. Please log in manually.';
    }
    console.error('Signup error:', error);
    return 'Something went wrong during signup. Please try again.';
  }

  redirect('/dashboard');
}

export async function deleteProperty(id: string) {
  try {
    await prisma.property.delete({ where: { id } });
  } catch (error) {
    console.error('Delete property error:', error);
    throw new Error('Failed to delete property.');
  }
  redirect('/dashboard/properties');
}

export async function approveLandlord(landlordId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized');
  }
  try {
    await prisma.landlord.update({
      where: { id: landlordId },
      data: { approvedAt: new Date(), approvedBy: (session.user as any).id },
    });
  } catch (error) {
    console.error('Approve landlord error:', error);
    throw new Error('Failed to approve landlord.');
  }
  revalidatePath('/dashboard/admin');
}

export async function rejectLandlord(landlordId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized');
  }
  try {
    const landlord = await prisma.landlord.findUnique({
      where: { id: landlordId },
      select: { userId: true },
    });
    if (!landlord) throw new Error('Landlord not found');
    await prisma.landlord.delete({ where: { id: landlordId } });
    await prisma.user.delete({ where: { id: landlord.userId } });
  } catch (error) {
    console.error('Reject landlord error:', error);
    throw new Error('Failed to reject landlord.');
  }
  revalidatePath('/dashboard/admin');
}

// ─── Invoice Actions ──────────────────────────────────────────────────────────

const InvoiceSchema = z.object({
  tenantId: z.string().min(1, 'Please select a tenant'),
  amount: z.coerce.number().gt(0, 'Amount must be greater than 0'),
  status: z.enum(['pending', 'paid', 'late'], {
    invalid_type_error: 'Please select a status',
  }),
});

export async function createInvoice(
  prevState: string | undefined,
  formData: FormData,
) {
  const validated = InvoiceSchema.safeParse({
    tenantId: formData.get('tenantId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validated.success) {
    return validated.error.issues[0].message;
  }

  const { tenantId, amount, status } = validated.data;
  // Store amounts in cents to avoid floating point issues
  const amountInCents = Math.round(amount * 100);

  try {
    await prisma.invoice.create({
      data: {
        tenantId,
        amount: amountInCents,
        status,
        date: new Date(),
      },
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    return 'Failed to create invoice.';
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: string | undefined,
  formData: FormData,
) {
  const validated = InvoiceSchema.safeParse({
    tenantId: formData.get('tenantId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validated.success) {
    return validated.error.issues[0].message;
  }

  const { tenantId, amount, status } = validated.data;
  const amountInCents = Math.round(amount * 100);

  try {
    await prisma.invoice.update({
      where: { id },
      data: { tenantId, amount: amountInCents, status },
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    return 'Failed to update invoice.';
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoice.delete({ where: { id } });
  } catch (error) {
    console.error('Delete invoice error:', error);
    throw new Error('Failed to delete invoice.');
  }
  revalidatePath('/dashboard/invoices');
}
