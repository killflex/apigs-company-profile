"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Upload,
  Linkedin,
  Instagram,
  Github,
  Twitter,
  Globe,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { getBestAvatarUrl, extractAvatarData } from "@/lib/utils/cloudinary";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  jobTitle: string;
  department: string | null;
  avatarPublicId: string | null;
  avatarUrl: string | null;
  avatarSecureUrl: string | null;
  avatarFormat: string | null;
  avatarWidth: number | null;
  avatarHeight: number | null;
  avatarVersion: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  githubUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  email: string | null;
  phone: string | null;
  startDate: Date | null;
  isActive: boolean;
  isPublic: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TeamMemberFormData {
  firstName: string;
  lastName: string;
  displayName: string;
  jobTitle: string;
  department: string;
  avatarPublicId: string;
  avatarUrl: string;
  avatarSecureUrl: string;
  avatarFormat: string;
  avatarWidth: number | null;
  avatarHeight: number | null;
  avatarVersion: string;
  linkedinUrl: string;
  instagramUrl: string;
  githubUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  email: string;
  phone: string;
  startDate: string;
  isActive: boolean;
  isPublic: boolean;
  sortOrder: number;
}

// Move TeamMemberForm outside the main component to prevent re-renders
const TeamMemberForm = ({
  isEdit = false,
  formData,
  setFormData,
  uploading,
  fileInputRef,
  handleFileUpload,
  handleSubmit,
  setIsCreateDialogOpen,
  setIsEditDialogOpen,
  resetForm,
}: {
  isEdit?: boolean;
  formData: TeamMemberFormData;
  setFormData: React.Dispatch<React.SetStateAction<TeamMemberFormData>>;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (file: File) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setIsCreateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;
}) => (
  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Avatar Upload Section */}
    <div className="space-y-4">
      <Label>Profile Picture</Label>
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={getBestAvatarUrl(
              formData.avatarPublicId,
              formData.firstName,
              formData.lastName
            )}
            alt={formData.displayName}
          />
          <AvatarFallback>
            {formData.firstName[0]}
            {formData.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Photo"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
          />
        </div>
      </div>
    </div>

    {/* Basic Information */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="firstName">First Name *</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => {
            const firstName = e.target.value;
            setFormData((prev) => ({
              ...prev,
              firstName,
              displayName: `${firstName} ${prev.lastName}`.trim(),
            }));
          }}
          required
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name *</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => {
            const lastName = e.target.value;
            setFormData((prev) => ({
              ...prev,
              lastName,
              displayName: `${prev.firstName} ${lastName}`.trim(),
            }));
          }}
          required
        />
      </div>
    </div>

    <div>
      <Label htmlFor="displayName">Display Name *</Label>
      <Input
        id="displayName"
        value={formData.displayName}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, displayName: e.target.value }))
        }
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="jobTitle">Job Title *</Label>
        <Input
          id="jobTitle"
          value={formData.jobTitle}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
          }
          placeholder="e.g., Founder - CEO"
          required
        />
      </div>
      <div>
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, department: e.target.value }))
          }
          placeholder="e.g., Executive, Engineering"
        />
      </div>
    </div>

    {/* Contact Information */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="john@company.com"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          placeholder="+1 (555) 123-4567"
        />
      </div>
    </div>

    {/* Social Media Links */}
    <div className="space-y-4">
      <Label>Social Media Links</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Label>
          <Input
            id="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))
            }
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        <div>
          <Label htmlFor="instagramUrl" className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram
          </Label>
          <Input
            id="instagramUrl"
            value={formData.instagramUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, instagramUrl: e.target.value }))
            }
            placeholder="https://instagram.com/username"
          />
        </div>
        <div>
          <Label htmlFor="githubUrl" className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            GitHub
          </Label>
          <Input
            id="githubUrl"
            value={formData.githubUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
            }
            placeholder="https://github.com/username"
          />
        </div>
        <div>
          <Label htmlFor="websiteUrl" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Website
          </Label>
          <Input
            id="websiteUrl"
            value={formData.websiteUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))
            }
            placeholder="https://website.com"
          />
        </div>
      </div>
    </div>

    {/* Employment Details */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, startDate: e.target.value }))
          }
        />
      </div>
      <div>
        <Label htmlFor="sortOrder">Sort Order</Label>
        <Input
          id="sortOrder"
          type="number"
          value={formData.sortOrder}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              sortOrder: parseInt(e.target.value) || 0,
            }))
          }
          placeholder="0"
        />
      </div>
    </div>

    {/* Status Switches */}
    <div className="flex space-x-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked: boolean) =>
            setFormData((prev) => ({ ...prev, isActive: checked }))
          }
        />
        <Label htmlFor="isActive">Active Employee</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isPublic"
          checked={formData.isPublic}
          onCheckedChange={(checked: boolean) =>
            setFormData((prev) => ({ ...prev, isPublic: checked }))
          }
        />
        <Label htmlFor="isPublic">Show on Public Team Page</Label>
      </div>
    </div>

    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          resetForm();
        }}
      >
        Cancel
      </Button>
      <Button type="submit">
        {isEdit ? "Update Team Member" : "Create Team Member"}
      </Button>
    </div>
  </form>
);

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(
    null
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<TeamMemberFormData>({
    firstName: "",
    lastName: "",
    displayName: "",
    jobTitle: "",
    department: "",
    avatarPublicId: "",
    avatarUrl: "",
    avatarSecureUrl: "",
    avatarFormat: "",
    avatarWidth: null,
    avatarHeight: null,
    avatarVersion: "",
    linkedinUrl: "",
    instagramUrl: "",
    githubUrl: "",
    twitterUrl: "",
    websiteUrl: "",
    email: "",
    phone: "",
    startDate: "",
    isActive: true,
    isPublic: true,
    sortOrder: 0,
  });

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/admin/team");
      if (!response.ok) throw new Error("Failed to fetch team members");
      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await fetch("/api/upload/team-avatar", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) throw new Error("Upload failed");

      const cloudinaryData = await response.json();
      const avatarData = extractAvatarData(cloudinaryData);

      setFormData((prev) => ({
        ...prev,
        ...avatarData,
      }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission for create/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.displayName.trim() ||
      !formData.jobTitle.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const url = editingTeamMember
        ? `/api/admin/team/${editingTeamMember.id}`
        : "/api/admin/team";

      const method = editingTeamMember ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save team member");

      resetForm();
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingTeamMember(null);
      fetchTeamMembers();

      toast.success(
        editingTeamMember ? "Team member updated!" : "Team member created!"
      );
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error("Failed to save team member");
    }
  };

  // Handle edit
  const handleEdit = (teamMember: TeamMember) => {
    setEditingTeamMember(teamMember);
    setFormData({
      firstName: teamMember.firstName,
      lastName: teamMember.lastName,
      displayName: teamMember.displayName,
      jobTitle: teamMember.jobTitle,
      department: teamMember.department || "",
      avatarPublicId: teamMember.avatarPublicId || "",
      avatarUrl: teamMember.avatarUrl || "",
      avatarSecureUrl: teamMember.avatarSecureUrl || "",
      avatarFormat: teamMember.avatarFormat || "",
      avatarWidth: teamMember.avatarWidth,
      avatarHeight: teamMember.avatarHeight,
      avatarVersion: teamMember.avatarVersion || "",
      linkedinUrl: teamMember.linkedinUrl || "",
      instagramUrl: teamMember.instagramUrl || "",
      githubUrl: teamMember.githubUrl || "",
      twitterUrl: teamMember.twitterUrl || "",
      websiteUrl: teamMember.websiteUrl || "",
      email: teamMember.email || "",
      phone: teamMember.phone || "",
      startDate: teamMember.startDate
        ? new Date(teamMember.startDate).toISOString().split("T")[0]
        : "",
      isActive: teamMember.isActive,
      isPublic: teamMember.isPublic,
      sortOrder: teamMember.sortOrder,
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete team member");

      fetchTeamMembers();
      toast.success("Team member deleted!");
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      displayName: "",
      jobTitle: "",
      department: "",
      avatarPublicId: "",
      avatarUrl: "",
      avatarSecureUrl: "",
      avatarFormat: "",
      avatarWidth: null,
      avatarHeight: null,
      avatarVersion: "",
      linkedinUrl: "",
      instagramUrl: "",
      githubUrl: "",
      twitterUrl: "",
      websiteUrl: "",
      email: "",
      phone: "",
      startDate: "",
      isActive: true,
      isPublic: true,
      sortOrder: 0,
    });
    setEditingTeamMember(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Team Members</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-20 w-20 bg-muted rounded-full mx-auto"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
                    <div className="h-3 w-24 bg-muted rounded mx-auto"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            <TeamMemberForm
              formData={formData}
              setFormData={setFormData}
              uploading={uploading}
              fileInputRef={fileInputRef}
              handleFileUpload={handleFileUpload}
              handleSubmit={handleSubmit}
              setIsCreateDialogOpen={setIsCreateDialogOpen}
              setIsEditDialogOpen={setIsEditDialogOpen}
              resetForm={resetForm}
            />
          </DialogContent>
        </Dialog>
      </div>

      {teamMembers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by adding your first team member.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Team Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={getBestAvatarUrl(
                          member.avatarPublicId,
                          member.firstName,
                          member.lastName
                        )}
                        alt={member.displayName}
                      />
                      <AvatarFallback>
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="font-semibold">{member.displayName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.jobTitle}
                    </p>
                    {member.department && (
                      <p className="text-xs text-muted-foreground">
                        {member.department}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center space-x-2">
                    {member.linkedinUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {member.instagramUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={member.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {member.githubUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={member.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex space-x-1">
                      {!member.isActive && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                          Inactive
                        </span>
                      )}
                      {!member.isPublic && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                          Private
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Team Member
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete{" "}
                              <strong>{member.displayName}</strong>? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(member.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <TeamMemberForm
            isEdit
            formData={formData}
            setFormData={setFormData}
            uploading={uploading}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            handleSubmit={handleSubmit}
            setIsCreateDialogOpen={setIsCreateDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            resetForm={resetForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
