import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // Create a serializable user profile object with only the data we need
  const serializableUserProfile = {
    firstName: user.firstName || "Admin",
    lastName: user.lastName || "",
    position: "Administrator",
    avatarUrl: user.imageUrl || "",
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar userProfile={serializableUserProfile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader userProfile={serializableUserProfile} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
          <Toaster richColors position="top-right" />
        </main>
      </div>
    </div>
  );
}
