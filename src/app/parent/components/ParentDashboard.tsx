"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Bell, 
  Wallet, 
  Calendar,
  Pin,
  ExternalLink,
  Clock,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { getParentDashboard } from "@/utils/api";
import { Child, Notice, Expense } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState("children");
  const [children, setChildren] = useState<Child[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getParentDashboard();
        console.log('Dashboard API Response:', response);
        
        // Use optional chaining to prevent errors if data is missing
        setChildren(response?.data?.children || []);
        setNotices(response?.data?.notices || []);
        setExpenses(response?.data?.expenses || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString("en-US", {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "announcement":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "alert":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "event":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "female":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Sort notices once and store in a variable
  const sortedNotices = [...notices].sort((a, b) => 
    (a?.isPinned === b?.isPinned ? 0 : a?.isPinned ? -1 : 1)
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Loading your dashboard...
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here&apos;s what&apos;s happening with your children.
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold mb-2">Error Loading Dashboard</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s what&apos;s happening with your children.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{children?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Notices</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notices?.filter(n => n?.isActive).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Unread announcements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Payment required</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="children">Children ({children?.length || 0})</TabsTrigger>
          <TabsTrigger value="notices">Notices ({notices?.length || 0})</TabsTrigger>
          <TabsTrigger value="expenses">Expenses ({expenses?.length || 0})</TabsTrigger>
        </TabsList>

        {/* Children Tab */}
        <TabsContent value="children" className="mt-4 space-y-4">
          {!children || children.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No children enrolled yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {children.map((child) => (
                <Card key={child?._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={`/images/user.png`} alt={`${child?.firstName} ${child?.lastName}`} />
                        <AvatarFallback>{getInitials(child?.firstName, child?.lastName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{child?.firstName} {child?.lastName}</CardTitle>
                        <CardDescription>
                          {child?.class?.className || 'N/A'} - {child?.class?.levelType || 'N/A'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Gender:</span>
                        <Badge variant="outline" className={getGenderColor(child?.gender)}>
                          {child?.gender || 'N/A'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Enrolled:</span>
                        <span className="font-medium">{formatDate(child?.createdAt)}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Attendance
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Notices Tab */}
        <TabsContent value="notices" className="mt-4 space-y-4">
          {!notices || notices.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notices available.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {notices.map((notice) => (
                <Card key={notice?._id} className={notice?.isPinned ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{notice?.title || 'Untitled Notice'}</CardTitle>
                          {notice?.isPinned && (
                            <Pin className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getNotificationColor(notice?.notificationType)}
                          >
                            {notice?.notificationType || 'general'}
                          </Badge>
                          {notice?.isActive && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatDate(notice?.expirationDate)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {notice?.content || 'No content available.'}
                    </p>
                    {notice?.resources && notice.resources.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Resources:</p>
                        {/* {notice.resources.map((resource, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full justify-between"
                            asChild
                          >
                            <a
                              href={resource || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="truncate">Attachment {index + 1}</span>
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        ))} */}

                        {notice.resources.map((resource, index) => (
                          // <Button
                          //   variant="outline"
                          //   size="sm"
                          //   className="w-full justify-between"
                          //   asChild
                          // >
                          <Link
                            key={index}
                              href={resource || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="truncate  text-blue-600 underline">Attachment {index + 1}</span>
                              {/* <ExternalLink className="h-4 w-4" /> */}
                            </Link>
                          // </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="mt-4 space-y-4">
          {!expenses || expenses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending expenses.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <Card key={expense?._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{expense?.description || 'Untitled Expense'}</CardTitle>
                        <CardDescription>{expense?.category || 'Uncategorized'}</CardDescription>
                      </div>
                      <Badge
                        variant={expense?.status === "paid" ? "default" : "destructive"}
                      >
                        {expense?.status || 'pending'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold">${expense?.amount || 0}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {formatDate(expense?.dueDate)}
                        </p>
                      </div>
                      {expense?.status !== "paid" && (
                        <Button>Pay Now</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentDashboard;