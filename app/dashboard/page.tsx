'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/modules/auth/infrastructure/store/useAuthStore';
import { StoreCreationFlow } from '@/modules/store/interfaces/ui/components/StoreCreationFlow';
import { useStoreStore } from '@/modules/store/infrastructure/store/useStoreStore';
import { useProfileStore } from '@/modules/profile/infrastructure/store/useProfileStore';
import { CreateProfileDialog } from '@/modules/profile/interfaces/ui/components/CreateProfileDialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StoreStats } from '@/modules/store/interfaces/ui/components/StoreStats';
import { useToast } from '@/hooks/use-toast';
import {
  Settings,
  Bell,
  Calendar,
  ArrowUpRight,
  Clock,
  PlusCircle
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile, loadProfile } = useProfileStore();
  const {
    store,
    repository,
    setStore,
    loading: storeLoading,
    resetStore,
  } = useStoreStore();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showStoreCreation, setShowStoreCreation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resumingSession, setResumingSession] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const initializeDashboard = async () => {
      try {
        await loadProfile(user.id);

        let currentStore = await repository.getStoreByUserId(user.id);

        if (!currentStore) {
          currentStore = await repository.createStore(user.id, {
            storeName: `${user.email?.split('@')[0]}'s Store`,
            storeUrl: '',
            businessType: '',
            industry: '',
            banners: [],
            location: {
              country: 'US',
              currency: 'USD',
              timezone: 'UTC',
            },
          });
          setStore(currentStore);
        } else {
          setStore(currentStore);
          if (
            currentStore.status === 'creating' ||
            currentStore.status === 'draft'
          ) {
            setResumingSession(true);
            setShowStoreCreation(true);
          }
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        toast({
          title: 'Error',
          description: 'Failed to initialize dashboard',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [user, router, loadProfile, repository, setStore, toast]);

  useEffect(() => {
    if (!loading && !profile) {
      setShowProfileDialog(true);
    }
  }, [loading, profile]);

  const handleCreateNewStore = () => {
    resetStore();
    setShowStoreCreation(true);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!store || showStoreCreation) {
    return (
      <>
        {showProfileDialog && (
          <CreateProfileDialog
            userId={user.id}
            email={user.email}
            open={showProfileDialog}
            onComplete={() => setShowProfileDialog(false)}
          />
        )}
        <StoreCreationFlow resumingSession={resumingSession} />
      </>
    );
  }

  const recentActivities = [
    {
      title: 'Store settings updated',
      time: '2 hours ago',
      icon: Settings,
      color: 'text-blue-500',
    },
    {
      title: 'New notification',
      time: '4 hours ago',
      icon: Bell,
      color: 'text-purple-500',
    },
    {
      title: 'Store customization completed',
      time: '6 hours ago',
      icon: Calendar,
      color: 'text-yellow-500',
    },
  ];

  const upcomingTasks = [
    {
      title: 'Review store settings',
      due: 'Today',
      priority: 'High',
      color: 'bg-red-100 text-red-700',
    },
    {
      title: 'Update store information',
      due: 'Tomorrow',
      priority: 'Medium',
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      title: 'Plan store updates',
      due: 'Next week',
      priority: 'Low',
      color: 'bg-green-100 text-green-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {profile?.username}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your store today
            </p>
          </div>
          <Button
            onClick={handleCreateNewStore}
            className="bg-shopify-purple hover:bg-shopify-purple/90"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Store
          </Button>
        </div>

        {/* Stats Grid */}
        <StoreStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div
                        className={`p-2 rounded-lg ${activity.color} bg-opacity-10`}
                      >
                        <activity.icon
                          className={`h-4 w-4 ${activity.color}`}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Due: {task.due}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${task.color}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}