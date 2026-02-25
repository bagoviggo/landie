'use server';
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { signOut } from '@/auth';
import { prisma } from '@/app/lib/prisma';
import * as bcrypt from 'bcrypt';
import { z } from 'zod';
import { redirect } from 'next/navigation';

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
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return 'An account with this email already exists.';
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        phone: phone || null,
        role,
      },
    });

    // Sign in the user after successful registration
    // signIn throws a redirect internally — let it propagate by NOT catching it here
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false, // we handle redirect ourselves below
    });
  } catch (error) {
    // AuthError means credentials failed after account creation — shouldn't happen
    // but handle gracefully
    if (error instanceof AuthError) {
      return 'Account created but sign-in failed. Please log in manually.';
    }
    console.error('Signup error:', error);
    return 'Something went wrong during signup. Please try again.';
  }

  // redirect() must be called outside try/catch — it throws internally
  // and a catch block would swallow it
  redirect('/dashboard');
}

export async function deleteProperty(id: string) {
  try {
    await prisma.property.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Delete property error:', error);
    throw new Error('Failed to delete property.');
  }
  // redirect outside try/catch for same reason as above
  redirect('/dashboard/properties');
}