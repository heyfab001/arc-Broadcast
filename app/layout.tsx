import type { Metadata } from "next";
import "./globals.css";
import { Web3Providers } from "@/components/wallet/Providers";
import { WalletProvider } from "@/hooks/useWallet";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ToastContainer } from "@/components/ui/Toast";
import { Footer } from "@/components/layout/Footer";
import { APP_NAME, APP_DESCRIPTION } from "@/config/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} | Built for Arc`,
  description: APP_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-arc-radial-glow text-slate-100 flex min-h-screen">
        <Web3Providers>
          <WalletProvider>
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <Navbar />
              <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
                {children}
              </main>
              <Footer />
            </div>

            <ToastContainer />
          </WalletProvider>
        </Web3Providers>
      </body>
    </html>
  );
}
