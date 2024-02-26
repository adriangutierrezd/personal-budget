import "./globals.css";
import { inter } from "./ui/fonts";
import SessionAuthProvider from "@/app/context/SessionAuthProvider";
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
        <body className={inter.className}>
            <SessionAuthProvider>
              {children}
              <Toaster />
            </SessionAuthProvider>
        </body>
    </html>
  );
}
