"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Building2, Target, MapPin, Clock, Globe, Save } from "lucide-react";

interface CompanyDetailsForm {
  // Stats
  teamMembersCount: number;
  yearsExperience: number;
  projectsCompleted: number;
  // Company Info
  companyName: string;
  tagline: string;
  aboutUs: string;
  vision: string;
  mission: string;
  // Contact
  officeAddress: string;
  officeAddressUrl: string;
  officePhone: string;
  contactEmail: string;
  supportEmail: string;
  // Operations
  operationalHours: string;
  timezone: string;
  // Social Media
  websiteUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  // Additional
  foundedYear: number | null;
  certifications: string[];
}

export default function CompanyDetailsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CompanyDetailsForm>({
    teamMembersCount: 0,
    yearsExperience: 0,
    projectsCompleted: 0,
    companyName: "APIGS Indonesia",
    tagline: "",
    aboutUs: "",
    vision: "",
    mission: "",
    officeAddress: "",
    officeAddressUrl: "",
    officePhone: "",
    contactEmail: "",
    supportEmail: "",
    operationalHours: "Monday-Friday, 9 AM - 6 PM",
    timezone: "Asia/Jakarta",
    websiteUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    foundedYear: null,
    certifications: [],
  });

  // Fetch company details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch("/api/admin/company-details");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setFormData({
          ...data,
          certifications: data.certifications || [],
        });
      } catch (error) {
        console.error("Error fetching company details:", error);
        toast.error("Failed to load company details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log("Submitting data:", formData);

      const response = await fetch("/api/admin/company-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to save");
      }

      toast.success("Company details updated successfully!");

      // Refresh the page data
      setFormData({
        ...result,
        certifications: result.certifications || [],
      });
    } catch (error) {
      console.error("Error saving company details:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save company details"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Company Details</h1>
          <p className="text-muted-foreground mt-1">
            Manage company information and statistics
          </p>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-8 w-full bg-muted rounded"></div>
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
      <div className="flex items-center justify-between bg-background py-4 -mt-4">
        <div>
          <h1 className="text-2xl font-bold">Company Details</h1>
          <p className="text-muted-foreground mt-1">
            Manage company information and statistics
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Company Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="teamMembersCount">Team Members Count</Label>
              <Input
                id="teamMembersCount"
                type="number"
                value={formData.teamMembersCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teamMembersCount: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="yearsExperience">Years Experience (Total)</Label>
              <Input
                id="yearsExperience"
                type="number"
                value={formData.yearsExperience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    yearsExperience: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="projectsCompleted">Projects Completed</Label>
              <Input
                id="projectsCompleted"
                type="number"
                value={formData.projectsCompleted}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectsCompleted: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                  placeholder="Company tagline or slogan"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="aboutUs">About Us</Label>
              <Textarea
                id="aboutUs"
                value={formData.aboutUs}
                onChange={(e) =>
                  setFormData({ ...formData, aboutUs: e.target.value })
                }
                rows={4}
                placeholder="Describe your company..."
              />
            </div>

            <div>
              <Label htmlFor="vision">Vision</Label>
              <Textarea
                id="vision"
                value={formData.vision}
                onChange={(e) =>
                  setFormData({ ...formData, vision: e.target.value })
                }
                rows={3}
                placeholder="Company vision statement..."
              />
            </div>

            <div>
              <Label htmlFor="mission">Mission</Label>
              <Textarea
                id="mission"
                value={formData.mission}
                onChange={(e) =>
                  setFormData({ ...formData, mission: e.target.value })
                }
                rows={3}
                placeholder="Company mission statement..."
              />
            </div>

            <div>
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                type="number"
                value={formData.foundedYear || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    foundedYear: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                placeholder="e.g., 2020"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="officeAddress">Office Address</Label>
              <Textarea
                id="officeAddress"
                value={formData.officeAddress}
                onChange={(e) =>
                  setFormData({ ...formData, officeAddress: e.target.value })
                }
                rows={2}
                placeholder="Full office address..."
              />
            </div>

            <div>
              <Label htmlFor="officeAddressUrl">
                Office Address URL (Google Maps)
              </Label>
              <Input
                id="officeAddressUrl"
                type="url"
                value={formData.officeAddressUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    officeAddressUrl: e.target.value,
                  })
                }
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="officePhone">Office Phone</Label>
                <Input
                  id="officePhone"
                  type="tel"
                  value={formData.officePhone}
                  onChange={(e) =>
                    setFormData({ ...formData, officePhone: e.target.value })
                  }
                  placeholder="+62 21 1234567"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  placeholder="contact@company.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={formData.supportEmail}
                onChange={(e) =>
                  setFormData({ ...formData, supportEmail: e.target.value })
                }
                placeholder="support@company.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Operational Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Operational Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="operationalHours">Operational Hours</Label>
              <Input
                id="operationalHours"
                value={formData.operationalHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    operationalHours: e.target.value,
                  })
                }
                placeholder="e.g., Monday-Friday, 9 AM - 6 PM"
              />
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) =>
                  setFormData({ ...formData, timezone: e.target.value })
                }
                placeholder="Asia/Jakarta"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media & Website */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Social Media & Website
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) =>
                  setFormData({ ...formData, websiteUrl: e.target.value })
                }
                placeholder="https://company.com"
              />
            </div>
            <div>
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData({ ...formData, linkedinUrl: e.target.value })
                }
                placeholder="https://linkedin.com/company/..."
              />
            </div>
            <div>
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input
                id="instagramUrl"
                type="url"
                value={formData.instagramUrl}
                onChange={(e) =>
                  setFormData({ ...formData, instagramUrl: e.target.value })
                }
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input
                id="facebookUrl"
                type="url"
                value={formData.facebookUrl}
                onChange={(e) =>
                  setFormData({ ...formData, facebookUrl: e.target.value })
                }
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <Label htmlFor="twitterUrl">Twitter/X URL</Label>
              <Input
                id="twitterUrl"
                type="url"
                value={formData.twitterUrl}
                onChange={(e) =>
                  setFormData({ ...formData, twitterUrl: e.target.value })
                }
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <Input
                id="youtubeUrl"
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) =>
                  setFormData({ ...formData, youtubeUrl: e.target.value })
                }
                placeholder="https://youtube.com/..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
