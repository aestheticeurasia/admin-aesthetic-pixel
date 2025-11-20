"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Image,
  NotebookPen,
  Eye,
  Activity,
  Camera,
  GalleryHorizontal,
} from "lucide-react";

const dashboardCards = [
  {
    icon: <Image className="h-6 w-6 text-red-500" />,
    title: "Total Photos",
    number: "1,234",
    content: "+12% from last month",
    iconBgColor: "bg-red-500/10",
    contentTextColor: "text-red-500",
  },
  {
    icon: <NotebookPen className="h-6 w-6 text-red-500" />,
    title: "Blog Posts",
    number: "42",
    content: "+5% from last month",
    iconBgColor: "bg-red-500/10",
    contentTextColor: "text-red-500",
  },
  {
    icon: <Eye className="h-6 w-6 text-red-500" />,
    title: "Gallery Views",
    number: "892",
    content: "+23% from last month",
    iconBgColor: "bg-red-500/10",
    contentTextColor: "text-red-500",
  },
  {
    icon: <Activity className="h-6 w-6 text-red-500" />,
    title: "Engagement",
    number: "64.2%",
    content: "-8% from last month",
    iconBgColor: "bg-red-500/10",
    contentTextColor: "text-red-500",
  },
];

const quickActions = [
  {
    icon: <Camera className="h-6 w-6 text-red-500" />,
    title: "Write New Post",
    description: "Share your latest photography story",
  },
  {
    icon: <GalleryHorizontal className="h-6 w-6 text-red-500" />,
    title: "View Blog",
    description: "Browse all your published posts",
  },
  {
    icon: <Camera className="h-6 w-6 text-red-500" />,
    title: "Upload Photos",
    description: "Add new images to your gallery",
  },
];

export default function AppDashboard() {
  return (
    <div className="mx-20">
      {/* Dashboard Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:py-10">
        {dashboardCards.map((card, index) => (
          <Card
            key={index}
            className="p-0 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {card.title}
                </h3>
                <div className={`p-2 rounded-lg ${card.iconBgColor}`}>
                  {card.icon}
                </div>
              </div>

              <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {card.number}
              </p>

              <p className={`text-sm ${card.contentTextColor} dark:text-red-400`}>
                {card.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Quick Actions Section */}
      <section>
        <div className="mt-10">
          <span className="ms-10 text-center md:text-start">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Quick Actions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start creating and managing your content
            </p>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={`action-${index}`}
                className="p-0 border-2 border-gray-200 dark:border-gray-700 shadow-none rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800"
              >
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className={`p-2 rounded-lg bg-red-500/10 self-start`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
