'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProfileStore } from '@/modules/profile/infrastructure/store/useProfileStore';
import { useAuthStore } from '@/modules/auth/infrastructure/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  phoneNumber: z.string().optional(),
});

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { profile, loadProfile, updateProfile, loading } = useProfileStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
    }
  }, [user, loadProfile]);

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username,
        phoneNumber: profile.phoneNumber,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: { username: string; phoneNumber?: string }) => {
    try {
      await updateProfile(data);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (err as Error).message,
      });
    }
  };

  if (!profile) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your profile details and preferences
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...register('username')}
              disabled={loading}
            />
            {errors.username && (
              <p className="text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
            <Input
              id="phoneNumber"
              type="tel"
              {...register('phoneNumber')}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={profile.email}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              Email cannot be changed
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            Update Profile
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}