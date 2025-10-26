"use client";


import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Briefcase, Users, School, CheckCircle, XCircle, Edit, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  
  const { toast } = useToast();
  const [parent, setParent] = useState<any>(mockParentData);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedOccupation, setEditedOccupation] = useState(parent.occupation);

  const handleToggleStatus = () => {
    setParent((prev: { isActive: any; }) => ({ ...prev, isActive: !prev.isActive }));
    toast({
      title: parent.isActive ? "Parent Deactivated" : "Parent Activated",
      description: `${parent.user?.firstName} ${parent.user?.lastName} has been ${parent.isActive ? 'deactivated' : 'activated'}.`,
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
            <Badge variant={parent.isActive ? "default" : "secondary"} className="text-sm">
              {parent.isActive ? (
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
                  <AvatarImage src={parent.user?.photo} alt={`${parent.user?.firstName} ${parent.user?.lastName}`} />
                  <AvatarFallback className="text-3xl">
                    {parent.user?.firstName?.[0]}{parent.user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">
                  {parent.user?.firstName} {parent.user?.lastName}
                </h2>
                <p className="text-muted-foreground">Parent</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{parent.user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{parent.user?.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Occupation</p>
                      <p className="font-medium">{parent.occupation}</p>
                    </div>
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setEditedOccupation(parent.occupation)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Occupation</DialogTitle>
                          <DialogDescription>
                            Update the parent's occupation information.
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
                    </Dialog>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <School className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Schools</p>
                    <p className="font-medium">{parent.schools.length} School(s)</p>
                  </div>
                </div>
              </div>

              <Separator />

              <Button 
                variant={parent.isActive ? "destructive" : "default"}
                className="w-full"
                onClick={handleToggleStatus}
              >
                {parent.isActive ? "Deactivate Parent" : "Activate Parent"}
              </Button>
            </CardContent>
          </Card>

          {/* Children and Additional Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Children Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Children ({parent.childrenDetails?.length || 0})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {parent.childrenDetails && parent.childrenDetails.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {parent.childrenDetails.map((child: any ) => (
                      <Card key={child._id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/student/${child._id}`)}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={child.photo} alt={`${child.firstName} ${child.lastName}`} />
                              <AvatarFallback>
                                {child.firstName?.[0]}{child.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {child.firstName} {child.lastName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {child.class.className}
                              </p>
                              <Badge variant="secondary" className="mt-1">
                                {child.class.levelType}
                              </Badge>
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

            {/* Account Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Account Status</p>
                    <p className="text-sm text-muted-foreground">
                      {parent.isActive ? "Parent can access the portal" : "Access is currently disabled"}
                    </p>
                  </div>
                  <Badge variant={parent.isActive ? "default" : "secondary"}>
                    {parent.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Parent ID</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {parent._id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">User ID</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {parent.userId}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
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
                    View Notices
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Send Message
                  </Button>
                  <Button variant="outline" className="justify-start">
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDetail;
