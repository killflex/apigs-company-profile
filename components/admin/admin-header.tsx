"use client";

import { UserButton } from "@clerk/nextjs";

export default function AdminHeader() {
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
