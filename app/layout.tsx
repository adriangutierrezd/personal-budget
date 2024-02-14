import "./globals.css";
import { inter } from "./ui/fonts";
import SessionAuthProvider from "@/app/context/SessionAuthProvider";

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
            </SessionAuthProvider>
        </body>
    </html>
  );
}
