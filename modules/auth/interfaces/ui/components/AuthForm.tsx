'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useAuthStore } from '../../../infrastructure/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const authSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.confirmPassword !== undefined) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

type AuthFormProps = {
  mode: 'login' | 'register';
  onSuccess?: () => void;
};

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  let { login, register: signUp, loading: isLoading, error } = useAuthStore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors: form_errors },
  } = useForm({
    resolver: zodResolver(authSchema),
  });
  const onSubmit = async (data: any) => {
    try {
      if (mode === 'login') {
        await login(data.email, data.password)
        toast({
          title: 'Success',
          description: 'Successfully logged in',
        });
      } else if (mode == 'register') {
        await signUp(data.email, data.password, data.confirmPassword)
        toast({
          title: 'Success',
          description: 'Account created successfully',
        });
      }
      onSuccess?.();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (err as Error).message,
      });
      throw err;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Login' : 'Create Account'}</CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Enter your credentials to access your account'
            : 'Fill in your details to create a new account'}
          {error && (
            <p className="text-sm font-medium text-destructive">
              {error as string}
            </p>
          )}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              disabled={isLoading}
              className={form_errors.email ? 'border-destructive' : ''}
              aria-invalid={form_errors.email ? 'true' : 'false'}
            />
            {form_errors.email && (
              <p className="text-sm font-medium text-destructive">
                {form_errors.email.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              disabled={isLoading}
              className={form_errors.password ? 'border-destructive' : ''}
              aria-invalid={form_errors.password ? 'true' : 'false'}
            />
            {form_errors.password && (
              <p className="text-sm font-medium text-destructive">
                {form_errors.password.message as string}
              </p>
            )}
          </div>
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                disabled={isLoading}
                className={
                  form_errors.confirmPassword ? 'border-destructive' : ''
                }
                aria-invalid={form_errors.confirmPassword ? 'true' : 'false'}
              />
              {form_errors.confirmPassword && (
                <p className="text-sm font-medium text-destructive">
                  {form_errors.confirmPassword.message as string}
                </p>
              )}
            </div>
          )}
          {mode === 'login' && (
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
