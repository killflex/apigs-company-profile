"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";

interface SerializableUserProfile {
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  avatarUrl: string | null;
}

interface AdminHeaderProps {
  userProfile: SerializableUserProfile;
}

export default function AdminHeader({ userProfile }: AdminHeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="flex h-16 items-center justify-end px-6">
        <div className="flex items-center gap-4">
          {/* User Menu */}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
