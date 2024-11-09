'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, Package, TrendingUp } from 'lucide-react';

const stats = [
  {
    title: "Total Sales",
    value: "$0.00",
    icon: DollarSign,
    description: "Total sales this month",
    change: "+0%",
    changeType: "neutral" as const
  },
  {
    title: "Active Customers",
    value: "0",
    icon: Users,
    description: "Active customers this month",
    change: "+0%",
    changeType: "neutral" as const
  },
  {
    title: "Products",
    value: "0",
    icon: Package,
    description: "Total products in store",
    change: "+0%",
    changeType: "neutral" as const
  },
  {
    title: "Conversion Rate",
    value: "0%",
    icon: TrendingUp,
    description: "Conversion rate this month",
    change: "+0%",
    changeType: "neutral" as const
  }
];

export function StoreStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
            <div className={`text-xs mt-1 ${
              stat.changeType === 'positive' 
                ? 'text-green-600' 
                : stat.changeType === 'negative'
                ? 'text-red-600'
                : 'text-muted-foreground'
            }`}>
              {stat.change} from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}