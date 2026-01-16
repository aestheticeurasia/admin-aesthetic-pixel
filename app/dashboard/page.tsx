"use client";

import React, { useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  ShoppingBag,
  Trash2,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/app/context/auth";
import { toast } from "sonner";
import axios from "axios";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DashboardData {
  pendingOrders: number;
  acceptedOrders: number;
  cancelledOrders: number;
  totalOrders: number;
}

export default function Dashboard() {
  const { auth } = useAuth();
  const [dashboardData, setDashboardData] = React.useState({
    pendingOrders: 0,
    acceptedOrders: 0,
    cancelledOrders: 0,
    totalOrders: 0,
  } as DashboardData);
  const [loading, setLoading] = React.useState<boolean>(false);

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/order/dashboard-data`
      );
      setDashboardData(data.data);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const cards = [
    {
      title: "Pending Orders",
      value: dashboardData.pendingOrders,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "hover:border-amber-500/30",
    },
    {
      title: "Accepted Orders",
      value: dashboardData.acceptedOrders,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "hover:border-emerald-500/30",
    },
    {
      title: "Cancelled Orders",
      value: dashboardData.cancelledOrders,
      icon: Trash2,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "hover:border-red-500/30",
    },
    {
      title: "Total Orders",
      value: dashboardData.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "hover:border-blue-500/30",
    },
  ];

  const chartData = [
    {
      label: "Pending",
      value: dashboardData.pendingOrders,
      color: "#f59e0b",
    },
    {
      label: "Accepted",
      value: dashboardData.acceptedOrders,
      color: "#22c55e",
    },
    {
      label: "Cancelled",
      value: dashboardData.cancelledOrders,
      color: "#ef4444",
    },
    {
      label: "Total",
      value: dashboardData.totalOrders,
      color: "#3b82f6",
    },
  ];

  return (
    <div className="min-h-screen py-5 lg:p-8 dark:bg-[#0a0a0b] text-slate-50">

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {cards.map((card) => (
          <Card
            key={card.title}
            className={`relative overflow-hidden border-slate-800/60  backdrop-blur-md transition-all duration-300 ${card.borderColor} group`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="dark:text-slate-400 group-hover:text-slate-200 transition-colors">
                {card.title}
              </CardTitle>
              <div
                className={`p-2 rounded-xl transition-colors ${card.bgColor}`}
              >
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between mt-1">
                <div className="text-4xl font-bold dark:text-white tabular-nums text-end lg:text-start">
                  {card.value}
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardContent>
            {/* Subtle bottom gradient accent */}
            <div
              className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ${card.color.replace(
                "text",
                "bg"
              )}`}
            />
          </Card>
        ))}
      </div>

      {/* Activity Chart Placeholder */}
      <div className="mt-8">
        <div className="lg:h-100 rounded-2xl border border-slate-800/50 bg-[#171717] backdrop-blur-sm lg:p-6 py-5 pr-10">
          <ChartContainer
            config={{
              value: { label: "Orders" },
            }}
            className="h-full w-full"
          >
            <BarChart data={chartData}>
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />

              <Bar dataKey="value" radius={6}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}