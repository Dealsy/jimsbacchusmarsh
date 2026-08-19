import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Raleway, Roboto } from "next/font/google";

import { GoogleTag } from "@/components/analytics/google-tag";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { Toaster } from "@/components/ui/toast";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { cn } from "@/lib/utils";

import "./globals.css";

const ralewayHeading = Raleway({
  subsets: ["latin"],
  variable: "--font-heading",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Jim's Window & Pressure Cleaning — Landing Pages",
    template: "%s",
  },
  description: "Local exterior cleaning landing pages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased font-sans",
        roboto.variable,
        ralewayHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <GoogleTag measurementId={gaMeasurementId} />
        <ClerkProvider appearance={clerkAppearance}>
          <ConvexClientProvider>
            {children}
            <Toaster />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
