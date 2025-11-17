"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Bell } from "lucide-react";
import { Notice } from "@/types";
import { NoticeDialog } from "./components/NoticeDialog";
import { NoticeViewModal } from "./components/NoticeViewModal";
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "@/utils/api";

interface PaginationInfo {
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}


const formatPagination = (apiPagination: any): PaginationInfo => ({
  total: Number(apiPagination.total || 0),
  currentPage: Number(apiPagination.currentPage || 1),
  pageSize: Number(apiPagination.pageSize || 20),
  totalPages: Number(apiPagination.totalPages || 0),
  hasNextPage: Boolean(apiPagination.hasNextPage),
  hasPreviousPage: Boolean(apiPagination.hasPreviousPage),
  nextPage: apiPagination.nextPage !== null ? Number(apiPagination.nextPage) : null,
  previousPage: apiPagination.previousPage !== null ? Number(apiPagination.previousPage) : null,
});


const Page = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Add this line
  const [deleteNoticeData, setDeleteNoticeData] = useState<Notice | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Pagination states
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    nextPage: null,
    previousPage: null
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch notices from API
  useEffect(() => {
  // Fetch the current page whenever it changes
  fetchNotices(currentPage, searchTerm);
}, [currentPage, searchTerm]);


useEffect(() => {
  const handler = setTimeout(() => {
    setCurrentPage(1); // reset page
  }, 500);

  return () => clearTimeout(handler);
}, [searchTerm]);


  const fetchNotices = async (page: number = 1, search: string = '') => {
  setLoading(true);
  try {
    const data = await getAllNotices(search, "", page, pagination.pageSize);
    const formattedPagination = formatPagination(data?.data?.pagination);

    setNotices(data?.data?.result || []);
    setPagination(formattedPagination);

    // Sync currentPage with API
    if (currentPage !== formattedPagination.currentPage) {
      setCurrentPage(formattedPagination.currentPage);
    }
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

  const handleView = (notice: Notice) => {
    setViewingNotice(notice);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (notice: Notice) => {
    setDeleteNoticeData(notice);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteNoticeData) return;
    
    setDeleteLoading(true);
    try {
      await deleteNotice(deleteNoticeData._id);
      toast({
        title: "Success",
        description: "Notice deleted successfully",
      });
      setIsDeleteModalOpen(false);
      setDeleteNoticeData(null);
      fetchNotices(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notice",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
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
      fetchNotices(); // Refresh the list
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

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages && pagination.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && pagination.hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers for pagination (same as AdminTable)
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "parent":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "staff":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      case "everyone":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      default:
        return "";
    }
  };

  const safeFormat = (dateInput: string | Date | undefined | null) => {
    if (!dateInput) return "N/A";
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN((d as Date).getTime())) return "N/A";
    return format(d as Date, "MMM dd, yyyy");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="w-full max-w-[1500px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">SQOOLIFY</h1>
              <p className="text-sm text-muted-foreground mt-1">Admin Portal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1500px] mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Notice Management
            </h2>
            <p className="text-muted-foreground">
              Create and manage notices for staff and parents
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10"
               onKeyDown={(e) => {
  if (e.key === "Enter") setCurrentPage(1); // triggers useEffect
}}

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
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Notices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                For Parents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  notices.filter(
                    (n) =>
                      n.visibility === "parent" || n.visibility === "everyone"
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                For Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  notices.filter(
                    (n) =>
                      n.visibility === "staff" || n.visibility === "everyone"
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Notices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  notices.filter((n) => new Date(n.expirationDate) > new Date())
                    .length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notices List */}
        <div className="grid gap-4 mb-6">
          {notices?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notices found</p>
                <Button
                  onClick={handleCreate}
                  variant="outline"
                  className="mt-4"
                >
                  Create your first notice
                </Button>
              </CardContent>
            </Card>
          ) : (
            notices.map((notice) => (
              <Card
                key={notice.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleView(notice)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {notice.title}
                        </h3>
                        <Badge
                          className={getVisibilityColor(notice.visibility)}
                        >
                          {notice.visibility}
                        </Badge>
                        {new Date(notice.expirationDate) < new Date() && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {notice.content}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <span>
                          Notification: {safeFormat(notice.notificationDate)}
                        </span>
                        <span>
                          Expires: {safeFormat(notice.expirationDate)}
                        </span>
                      </div>
                      {/* {notice.resources.length > 0 && (
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
                                onClick={(e) => e.stopPropagation()}
                              >
                                📎 {resource}
                              </a>
                            ))}
                          </div>
                        </div>
                      )} */}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(notice);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(notice);
                        }}
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

        {/* Pagination - Using the same design as AdminTable */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">
                Showing {notices.length} of {pagination.total} items (Page {currentPage} of {pagination.totalPages})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 text-sm rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                disabled={!pagination.hasPreviousPage}
                onClick={handlePrevPage}
              >
                Previous
              </button>

              {/* Page numbers */}
              {generatePageNumbers().map(page => (
                <button
                  key={page}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    page === currentPage ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="px-3 py-2 text-sm rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                disabled={!pagination.hasNextPage}
                onClick={handleNextPage}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <NoticeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        notice={editingNotice}
        onSave={handleSave}
      />

      {/* View Notice Modal */}
      <NoticeViewModal
        notice={viewingNotice}
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Notice"
        description={`Are you sure you want to delete "${deleteNoticeData?.title}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Page;