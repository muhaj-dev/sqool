'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Bell } from "lucide-react";
import { Notice } from "@/types";
import { NoticeDialog } from "./components/NoticeDialog";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "@/utils/api";

const Page = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Fetch notices from API
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const data = await getAllNotices(searchTerm, "", 20);
      setNotices(data.result || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingNotice(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setIsDialogOpen(true);
  };

  const handleDelete = async (noticeId: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    setLoading(true);
    try {
      await deleteNotice(noticeId);
      setNotices(notices.filter(n => n.id !== noticeId));
      toast({
        title: "Success",
        description: "Notice deleted successfully",
      });
      fetchNotices();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (noticeData: Notice) => {
    setLoading(true);
    try {
      if (editingNotice?.id) {
        await updateNotice(editingNotice.id, noticeData);
        toast({
          title: "Success",
          description: "Notice updated successfully",
        });
      } else {
        await createNotice(noticeData);
        toast({
          title: "Success",
          description: "Notice created successfully",
        });
      }
      setIsDialogOpen(false);
      fetchNotices();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "parent": return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "staff": return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      case "everyone": return "bg-green-500/10 text-green-700 dark:text-green-400";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">SQOOLIFY</h1>
              <p className="text-sm text-muted-foreground mt-1">Admin Portal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Notice Management
            </h2>
            <p className="text-muted-foreground">Create and manage notices for staff and parents</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10"
                onBlur={fetchNotices}
                onKeyDown={e => { if (e.key === "Enter") fetchNotices(); }}
              />
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Notice
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Notices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notices.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">For Parents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notices.filter(n => n.visibility === "parent" || n.visibility === "everyone").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">For Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notices.filter(n => n.visibility === "staff" || n.visibility === "everyone").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Notices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notices.filter(n => new Date(n.expirationDate) > new Date()).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notices List */}
        <div className="grid gap-4">
          {filteredNotices.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notices found</p>
                <Button onClick={handleCreate} variant="outline" className="mt-4">
                  Create your first notice
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredNotices.map((notice) => (
              <Card key={notice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{notice.title}</h3>
                        <Badge className={getVisibilityColor(notice.visibility)}>
                          {notice.visibility}
                        </Badge>
                        {new Date(notice.expirationDate) < new Date() && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{notice.content}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <span>Notification: {format(new Date(notice.notificationDate), "MMM dd, yyyy")}</span>
                        <span>Expires: {format(new Date(notice.expirationDate), "MMM dd, yyyy")}</span>
                      </div>
                      {notice.resources.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-2">Resources:</p>
                          <div className="grid gap-2">
                            {notice.resources.map((resource, idx) => (
                              <a
                                key={idx}
                                href={resource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                              >
                                📎 {resource}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(notice)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(notice.id!)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <NoticeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        notice={editingNotice}
        onSave={handleSave}
      />
    </div>
  );
};

export default Page;