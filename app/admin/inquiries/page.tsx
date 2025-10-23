"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  Building,
  Calendar,
  User,
  MessageSquare,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  RefreshCw,
  Trash2,
  Loader2,
  Edit,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  inquiryType: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  followUpDate: Date | null;
  notes: string | null;
};

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];

const priorityOptions = [
  { value: "all", label: "All Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const inquiryTypeOptions = [
  { value: "all", label: "All Types" },
  { value: "general", label: "General" },
  { value: "project", label: "Project" },
  { value: "partnership", label: "Partnership" },
  { value: "career", label: "Career" },
];

export default function InquiryManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);
  const [editForm, setEditForm] = useState({
    status: "",
    priority: "",
    followUpDate: "",
    notes: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch inquiries from API
  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        status: filterStatus,
        priority: filterPriority,
        type: filterType,
      });

      const response = await fetch(`/api/admin/inquiries?${params}`);
      const data = await response.json();

      if (data.success) {
        setInquiries(data.inquiries);
      } else {
        console.error("Failed to fetch inquiries:", data.error);
        toast.error("Failed to load inquiries", {
          description: data.error || "Could not fetch inquiries from server.",
        });
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Network error", {
        description: "Failed to connect to server. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch inquiries on mount and when filters change
  useEffect(() => {
    fetchInquiries();
  }, [searchTerm, filterStatus, filterPriority, filterType]);

  const handleOpenDeleteDialog = (id: string) => {
    setInquiryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setInquiryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!inquiryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/inquiries?id=${inquiryToDelete}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Inquiry deleted successfully", {
          description: "The inquiry has been removed from the system.",
        });
        handleCloseDeleteDialog();
        fetchInquiries();
      } else {
        toast.error("Failed to delete inquiry", {
          description: data.error || "An error occurred while deleting.",
        });
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Failed to delete inquiry", {
        description: "Network error. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    handleOpenDeleteDialog(id);
  };

  const handleOpenEditDialog = (inquiry: Inquiry) => {
    setEditingInquiry(inquiry);
    setEditForm({
      status: inquiry.status,
      priority: inquiry.priority,
      followUpDate: inquiry.followUpDate
        ? new Date(inquiry.followUpDate).toISOString().split("T")[0]
        : "",
      notes: inquiry.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingInquiry(null);
    setEditForm({
      status: "",
      priority: "",
      followUpDate: "",
      notes: "",
    });
  };

  const handleUpdateInquiry = async () => {
    if (!editingInquiry) return;

    setIsSaving(true);
    try {
      const updateData: any = {
        status: editForm.status,
        priority: editForm.priority,
        notes: editForm.notes || null,
      };

      if (editForm.followUpDate) {
        updateData.followUpDate = new Date(editForm.followUpDate).toISOString();
      }

      const response = await fetch(
        `/api/admin/inquiries?id=${editingInquiry.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Inquiry updated successfully", {
          description: "Changes have been saved.",
        });
        handleCloseEditDialog();
        fetchInquiries();
      } else {
        toast.error("Failed to update inquiry", {
          description: data.error || "An error occurred while updating.",
        });
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
      toast.error("Failed to update inquiry", {
        description: "Network error. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Filter inquiries (now done on server side, but keep for client-side refinement)
  const filteredInquiries = inquiries;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "contacted":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "qualified":
        return <Star className="h-4 w-4 text-purple-600" />;
      case "converted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Inquiry Management</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and leads
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInquiries}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredInquiries.length} inquiries
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, company, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {inquiryTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading inquiries...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <Card
              key={inquiry.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">
                            {inquiry.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(inquiry.status)}
                            <span className="text-sm capitalize">
                              {inquiry.status}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(
                              inquiry.priority
                            )}`}
                          >
                            {inquiry.priority}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-primary">
                          {inquiry.subject}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {inquiry.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {inquiry.email}
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {inquiry.phone}
                        </div>
                      )}
                      {inquiry.company && (
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {inquiry.company}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(inquiry.createdAt)}
                      </div>
                    </div>

                    {inquiry.notes && (
                      <div className="p-3 bg-muted rounded text-sm">
                        <strong>Notes:</strong> {inquiry.notes}
                      </div>
                    )}

                    {inquiry.followUpDate && (
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <Calendar className="h-4 w-4" />
                        Follow up: {formatDate(inquiry.followUpDate)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditDialog(inquiry)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteInquiry(inquiry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredInquiries.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No inquiries found matching your criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Edit Inquiry Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Inquiry</DialogTitle>
            <DialogDescription>
              Update inquiry status, priority, and add notes
            </DialogDescription>
          </DialogHeader>

          {editingInquiry && (
            <div className="space-y-4 py-4">
              {/* Inquiry Details (Read-only) */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div>
                  <span className="text-sm font-semibold">Name:</span>{" "}
                  {editingInquiry.name}
                </div>
                <div>
                  <span className="text-sm font-semibold">Email:</span>{" "}
                  {editingInquiry.email}
                </div>
                <div>
                  <span className="text-sm font-semibold">Subject:</span>{" "}
                  {editingInquiry.subject}
                </div>
                <div>
                  <span className="text-sm font-semibold">Message:</span>
                  <p className="text-sm mt-1 whitespace-pre-wrap">
                    {editingInquiry.message}
                  </p>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, status: value })
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority *</Label>
                  <Select
                    value={editForm.priority}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, priority: value })
                    }
                  >
                    <SelectTrigger id="edit-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-followup">Follow-up Date</Label>
                  <Input
                    id="edit-followup"
                    type="date"
                    value={editForm.followUpDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, followUpDate: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Internal Notes</Label>
                  <Textarea
                    id="edit-notes"
                    placeholder="Add internal notes about this inquiry..."
                    rows={4}
                    value={editForm.notes}
                    onChange={(e) =>
                      setEditForm({ ...editForm, notes: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    These notes are for internal use only and will not be
                    visible to the customer.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseEditDialog}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleUpdateInquiry} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              inquiry from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCloseDeleteDialog}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
