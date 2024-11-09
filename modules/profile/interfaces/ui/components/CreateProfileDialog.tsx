'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProfileStore } from '../../../infrastructure/store/useProfileStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { CountrySelect } from './CountrySelect';
import { PhoneInput } from './PhoneInput';

const profileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  countryCode: z.string(),
});

interface CreateProfileDialogProps {
  userId: string;
  email: string;
  open: boolean;
  onComplete: () => void;
}

export function CreateProfileDialog({ userId, email, open, onComplete }: CreateProfileDialogProps) {
  const { createProfile, loading } = useProfileStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: email.split('@')[0],
      phoneNumber: '',
      countryCode: 'US',
    },
  });

  const countryCode = watch('countryCode');

  const onSubmit = async (data: { 
    username: string; 
    phoneNumber?: string;
    countryCode: string;
  }) => {
    try {
      const formattedPhone = data.phoneNumber 
        ? `${data.phoneNumber.replace(/^0+/, '')}`
        : undefined;

      await createProfile(
        userId,
        email,
        data.username,
        formattedPhone,
        {
          address: data.countryCode
        }
      );
      toast({
        title: 'Success',
        description: 'Profile created successfully',
      });
      onComplete();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (err as Error).message,
      });
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide some additional information to complete your profile setup.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

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
            <Label>Country</Label>
            <CountrySelect
              value={countryCode}
              onValueChange={(value) => setValue('countryCode', value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
            <PhoneInput
              countryCode={countryCode}
              value={watch('phoneNumber') || ''}
              onChange={(value) => setValue('phoneNumber', value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            Create Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}