import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import PushNotificationHandler from "@/lib/notifications/notification-handler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Squanch Bros",
  description: "The one squanch to rule them all",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>
      <body className={inter.className}>
        <PushNotificationHandler />
        {children}
      </body>
    </html>
  );
}
