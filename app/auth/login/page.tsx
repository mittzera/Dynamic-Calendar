import { LoginForm } from "@/components/forms/login-form";
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Dynamic Calendar
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs bg-brand-background p-10 rounded-lg shadow-lg">
            <LoginForm />
          </div>
        </div>
      </div>
      <Image
        src="/onecalendar.jpg"
        alt="Image"
        fill
        className="object-cover dark:brightness-[0.2] dark:grayscale -z-10"
      />
    </div>
  );
}
