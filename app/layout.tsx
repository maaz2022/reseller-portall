import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reseller Portal",
  description: "Your one-stop solution for premium reselling services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors position="top-center" />
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
