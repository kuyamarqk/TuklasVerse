
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
 
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
      <body className={`${geist.className} bg-[#0a0a0f] text-white antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
 
