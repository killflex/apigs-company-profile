"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  Building2,
  Quote,
  Users,
  FileText,
} from "lucide-react";

interface SerializableUserProfile {
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  avatarUrl: string | null;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Company Details",
    href: "/admin/company-details",
    icon: Building2,
  },
  {
    name: "Portfolio",
    href: "/admin/portfolio",
    icon: FolderOpen,
  },
  {
    name: "Blog",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    name: "Inquiries",
    href: "/admin/inquiries",
    icon: MessageSquare,
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: Quote,
  },
  {
    name: "Team",
    href: "/admin/team",
    icon: Users,
  },
];

interface AdminSidebarProps {
  userProfile: SerializableUserProfile;
}

export default function AdminSidebar({ userProfile }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-muted/20 border-r border-border">
      {/* Logo/Brand */}
      <div className="flex h-16 justify-center items-center px-6 border-b border-border">
        <Link
          href="/"
          aria-label="home"
          className="flex justify-center items-center space-x-2"
        >
          <Image
            className="h-8 w-auto dark:invert"
            src="/apigs-logo.png"
            alt="Logo"
            height={1804}
            width={476}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {userProfile.firstName?.[0] || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {userProfile.firstName} {userProfile.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userProfile.position || "Administrator"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
