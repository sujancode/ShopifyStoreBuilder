'use client';

import { useState } from 'react';
import { Check, LockIcon, AlertCircle } from 'lucide-react';
import { useStoreStore, STORE_STEPS } from '@/modules/store/infrastructure/store/useStoreStore';
import { useAuthStore } from '@/modules/auth/infrastructure/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StoreBasicInfo } from './steps/StoreBasicInfo';
import { StoreBanners } from './steps/StoreBanners';
import { CreateShopifyAccount } from './steps/CreateShopifyAccount';
import { LinkShopifyStore } from './steps/LinkShopifyStore';
import { ShopifyDiscount } from './steps/ShopifyDiscount';
import { InstallBuildApp } from './steps/InstallBuildApp';
import { CustomizeStore } from './steps/CustomizeStore';

const StepComponents = {
  'store-niche': StoreBasicInfo,
  'banners': StoreBanners,
  'shopify-account': CreateShopifyAccount,
  'link-store': LinkShopifyStore,
  'discount': ShopifyDiscount,
  'install-app': InstallBuildApp,
  'customize': CustomizeStore,
};

interface StoreCreationFlowProps {
  resumingSession?: boolean;
}

export function StoreCreationFlow({ resumingSession = false }: StoreCreationFlowProps) {
  const { user } = useAuthStore();
  const { 
    store,
    currentStep, 
    setCurrentStep, 
    isStepCompleted,
    canProceedToStep,
    completeStep,
  } = useStoreStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const { toast } = useToast();

  const handleStepClick = (index: number) => {
    if (index === currentStep) return;

    if (!canProceedToStep(index)) {
      toast({
        title: "Step locked",
        description: "Please complete the previous steps first",
        variant: "destructive"
      });
      return;
    }

    if (index < currentStep || isStepCompleted(STORE_STEPS[index].id)) {
      setSelectedStep(index);
      setDialogOpen(true);
    }
  };

  const handleStepConfirm = () => {
    if (selectedStep !== null) {
      setCurrentStep(selectedStep);
      setDialogOpen(false);
      setSelectedStep(null);
    }
  };

  const handleStepComplete = async () => {
    const currentStepId = STORE_STEPS[currentStep].id;
    completeStep(currentStepId);
    
    if (currentStep < STORE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const CurrentStepComponent = StepComponents[STORE_STEPS[currentStep].id as keyof typeof StepComponents];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-shopify-purple/5 to-shopify-indigo/5 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {resumingSession && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Welcome back! We've restored your progress. You can continue building your store from where you left off.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Build Your AI-Powered Shopify Store
          </h1>
          <p className="text-sm text-muted-foreground">
            Follow these steps to create your professional Shopify store
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Steps List */}
          <div className="col-span-4">
            <div className="relative space-y-2">
              {/* Progress Line */}
              <div className="hidden lg:block absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200">
                <div 
                  className="absolute top-0 bg-shopify-purple transition-all duration-500"
                  style={{ 
                    height: `${(currentStep / (STORE_STEPS.length - 1)) * 100}%`,
                    width: '2px'
                  }}
                />
              </div>

              {STORE_STEPS.map((step, index) => {
                const isCompleted = isStepCompleted(step.id);
                const isCurrent = index === currentStep;
                const isLocked = !canProceedToStep(index);

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    disabled={isLocked && !isCurrent}
                    className={`
                      relative w-full pl-10 pr-4 py-3 rounded-lg text-left transition-all duration-300
                      ${isCurrent ? 'bg-white shadow-sm' : ''}
                      ${isLocked ? 'opacity-50' : 'hover:bg-white/50'}
                    `}
                  >
                    <div className={`
                      absolute left-2 w-6 h-6 rounded-full flex items-center justify-center
                      ${isCompleted
                        ? 'bg-shopify-purple text-white'
                        : isCurrent
                        ? 'bg-shopify-purple/10 text-shopify-purple'
                        : 'bg-gray-100 text-gray-400'
                      }
                    `}>
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : isLocked ? (
                        <LockIcon className="w-3 h-3" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{step.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Step Content */}
          <div className="col-span-8">
            {CurrentStepComponent && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{STORE_STEPS[currentStep].title}</CardTitle>
                  <CardDescription className="text-sm">{STORE_STEPS[currentStep].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CurrentStepComponent onComplete={handleStepComplete} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Confirm Step Change
              </DialogTitle>
              <DialogDescription>
                {selectedStep !== null && STORE_STEPS[selectedStep].warning}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStepConfirm}>
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}