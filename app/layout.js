import { Outfit } from 'next/font/google';
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from '../components/ui/sonner';

export const metadata = {
  title: "Ai PDF Note Taker",
  description: "SAAS Platform to take note from pdf esay using AI tools",
};
const outfit = Outfit({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body 
        className={outfit.className}
      >
        <Provider>
          {children}
        </Provider>
        <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}