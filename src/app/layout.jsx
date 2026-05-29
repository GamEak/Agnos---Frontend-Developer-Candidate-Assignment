import { Geist } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata = {
  title: "Agnos",
  description: "Agnos - Frontend Developer Candidate Assignment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`min-h-full ${geistSans.className} flex flex-col`}>
        <nav className="fixed w-full px-[1.5rem] py-[1rem] bg-blue-200/50 backdrop-blur-sm">
          <Image
            src="agnos-logo-with-text.svg" // Path to image in the /public folder
            alt="agnos-logo-with-text"
            width={100}
            height={100}
          />
        </nav>
        <div className="mt-[3.5rem] lg:mt-[5rem]"></div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
