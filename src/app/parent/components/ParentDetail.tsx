"use client";

import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, Briefcase, Users, School, CheckCircle, XCircle, Edit, AlertCircle, Bell, Wallet, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useAuthStore } from "@/zustand/authStore";
import { useRouter } from "next/navigation";
import { getParentDashboard } from "@/utils/api";

// Mock data - replace with actual API call
const mockParentData: any = {
  _id: "683112addb58d74f5da0511b",
  userId: "683112addb58d74f5da05119",
  children: ["683112addb58d74f5da05120"],
  occupation: "Lecturer",
  schools: ["6828ae29252ba86fcc693144"],
  isActive: true,
  user: {
    firstName: "Adewale",
    lastName: "Okonkwo",
    email: "adewale.okonkwo@email.com",
    phone: "+234 803 456 7890",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adewale"
  },
  childrenDetails: [
    {
      _id: "683112addb58d74f5da05120",
      firstName: "Chioma",
      lastName: "Okonkwo",
      class: {
        className: "JSS 2A",
        levelType: "Junior Secondary"
      },
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma"
    }
  ]
};

const ParentDetail = () => {
  const router = useRouter();
  const { user } = useAuthStore.getState();
  const { toast } = useToast();
  const [parent, setParent] = useState<any>(mockParentData);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedOccupation, setEditedOccupation] = useState(parent.occupation);
  
  // Dashboard data states
  const [children, setChildren] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use auth user data to enhance parent information
  const displayUser = user || parent?.user;
  const displayName = `${displayUser?.firstName || ''} ${displayUser?.lastName || ''}`.trim();
  const avatarInitials = `${displayUser?.firstName?.[0] || ''}${displayUser?.lastName?.[0] || ''}`;
  const phoneNumber = displayUser?.phoneId?.phoneNumber || parent?.user?.phone;
  const email = displayUser?.email || parent?.user?.email;
  const schoolName = displayUser?.school?.name || 'Al-Faruq';

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getParentDashboard();
        setChildren(response?.data?.children || []);
        setNotices(response?.data?.notices || []);
        setExpenses(response?.data?.expenses || []);
        setError(null);

        // Save to localStorage
        localStorage.setItem("parentDashboard", JSON.stringify(response?.data?.children));
      } catch (err) {
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

  const handleToggleStatus = () => {
    setParent((prev: { isActive: any; }) => ({ ...prev, isActive: !prev.isActive }));
    toast({
      title: parent.isActive ? "Parent Deactivated" : "Parent Activated",
      description: `${displayName} has been ${parent.isActive ? 'deactivated' : 'activated'}.`,
    });
  };

  const handleUpdateOccupation = () => {
    setParent((prev: any) => ({ ...prev, occupation: editedOccupation }));
    setIsEditDialogOpen(false);
    toast({
      title: "Occupation Updated",
      description: "Parent occupation has been successfully updated.",
    });
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/dashboard")}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Parent Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    View and manage parent information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading dashboard data...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Parent Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  View and manage parent information
                </p>
              </div>
            </div>
            <Badge variant={parent?.isActive ? "default" : "secondary"} className="text-sm">
              {parent?.isActive ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-1" />
                  Inactive
                </>
              )}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          {/* Parent Information Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Parent Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={parent?.user?.photo} alt={displayName} />
                  <AvatarFallback className="text-3xl">
                    {avatarInitials || "P"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">
                  {displayName || "Parent"}
                </h2>
                <p className="text-muted-foreground">Parent</p>
                <Badge variant="secondary" className="mt-2">
                  {schoolName}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{email || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{phoneNumber || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Occupation</p>
                      <p className="font-medium">{parent?.occupation || "N/A"}</p>
                    </div>
                    {/* <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setEditedOccupation(parent?.occupation)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Occupation</DialogTitle>
                          <DialogDescription>
                            Update the parent&apos;s occupation information.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="occupation">Occupation</Label>
                            <Input
                              id="occupation"
                              value={editedOccupation}
                              onChange={(e) => setEditedOccupation(e.target.value)}
                              placeholder="Enter occupation"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateOccupation}>
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog> */}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <School className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">School</p>
                    <p className="font-medium">{schoolName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium capitalize">{displayUser?.role || "Parent"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* <Button 
                variant={parent?.isActive ? "destructive" : "default"}
                className="w-full"
                onClick={handleToggleStatus}
              >
                {parent?.isActive ? "Deactivate Parent" : "Activate Parent"}
              </Button> */}
            </CardContent>
          </Card>

          {/* Children and Additional Info */}
          <div className="lg:col-span-2 space-y-6">
             <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start" onClick={() => router.push(`/parent/fees`)}>
                    View Fee Records
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => router.push(`/parent/notices`)}>
                    View All Notices
                  </Button>
                  {/* <Button variant="outline" className="justify-start">
                    Send Message
                  </Button> */}
                  
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Children Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Children ({children?.length || 0})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {children && children.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {children.map((child: any) => (
                      <Card key={child?._id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/student/${child?._id}`)}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={`/images/user.png`} alt={`${child?.firstName} ${child?.lastName}`} />
                              <AvatarFallback>{getInitials(child?.firstName, child?.lastName)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {child?.firstName} {child?.lastName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {child?.class?.className || 'N/A'} - {child?.class?.levelType || 'N/A'}
                              </p>
                              <Badge variant="outline" className={getGenderColor(child?.gender)}>
                                {child?.gender || 'N/A'}
                              </Badge>
                              <div className="mt-2 text-xs text-muted-foreground">
                                Enrolled: {formatDate(child?.createdAt)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No children registered</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notices Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Notices ({notices?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notices && notices.length > 0 ? (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {notices.slice(0, 5).map((notice: any) => (
                      <Card key={notice?._id} className={notice?.isPinned ? "border-primary" : ""}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-base">{notice?.title || 'Untitled Notice'}</CardTitle>
                                {notice?.isPinned && (
                                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                                    Pinned
                                  </Badge>
                                )}
                              </div>
                              <CardDescription className="line-clamp-2">
                                {notice?.content || 'No content available.'}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <Badge variant="outline">
                              {notice?.notificationType || 'general'}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(notice?.expirationDate)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No notices available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          
            {/* Quick Actions Card */}
           
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDetail;