
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import GoogleAnalytics from '@/component/GoogleAnalytics'
 
const geist = Geist({ subsets: ["latin"] });
 
export const metadata: Metadata = {
  title: "TuklasVerse",
  description: "Your personal media universe",
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="google-site-verification" content="lydAmxF8T7r4M7VCZIf9zimI6RKJy2IioD9e-Qgq70U" />
      <body className={`${geist.className} bg-[#0a0a0f] text-white antialiased`}>
        <GoogleAnalytics />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
 
