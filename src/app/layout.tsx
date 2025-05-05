import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import AppLayout from "@/components/AppLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JARVIS CRM",
  description: "CRM applicatie met checklist en aannemersbeheer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body className={`${inter.className} bg-[#0f172a] text-white flex flex-col min-h-screen`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

