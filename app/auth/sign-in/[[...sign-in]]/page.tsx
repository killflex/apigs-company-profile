import Image from "next/image";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col justify-center items-center text-center mb-8">
          <Image
            className="h-8 w-auto dark:invert"
            src="/apigs-logo.png"
            alt="Logo"
            height={1804}
            width={476}
          />
          <h1 className="text-2xl font-semibold mb-2"></h1>
          <p className="text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>
        <SignIn
          fallbackRedirectUrl="/admin"
          signUpUrl=""
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg",
            },
          }}
        />
      </div>
    </div>
  );
}
