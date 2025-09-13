import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: {
    default: "Career Counselor AI - Professional Career Guidance",
    template: "%s | Career Counselor AI",
  },
  description:
    "Get expert career guidance powered by AI. Explore career paths, improve your resume, prepare for interviews, and develop professional skills with personalized advice from our intelligent career counselor.",
  keywords: [
    "career counseling",
    "career advice",
    "resume review",
    "interview preparation",
    "job search",
    "professional development",
    "career guidance",
    "AI counselor",
    "career planning",
    "skill development",
  ],
  authors: [{ name: "Career Counselor AI" }],
  creator: "Career Counselor AI",
  publisher: "Career Counselor AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://career-counselor-ai.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://career-counselor-ai.com",
    title: "Career Counselor AI - Professional Career Guidance",
    description:
      "Get expert career guidance powered by AI. Explore career paths, improve your resume, prepare for interviews, and develop professional skills.",
    siteName: "Career Counselor AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Career Counselor AI - Professional Career Guidance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Counselor AI - Professional Career Guidance",
    description:
      "Get expert career guidance powered by AI. Explore career paths, improve your resume, prepare for interviews, and develop professional skills.",
    images: ["/og-image.jpg"],
    creator: "@career_counselor_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
  manifest: "/manifest.json",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
