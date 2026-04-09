import type { Metadata, Viewport } from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ContentProtection } from '@/components/content-protection';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AuthGuard } from '@/components/auth-guard';
import { NavHeader } from '@/components/nav-header';
import Link from 'next/link';
import { ShieldCheck, Scale } from 'lucide-react';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import { PWARegister } from '@/components/pwa-register';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'NTET Prep Pro',
  description: 'Advanced preparation portal for National Teachers Eligibility Test.',
  manifest: '/manifest.json',
  metadataBase: new URL('https://studio--studio-2778666172-129df.us-central1.hosted.app'),
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NTET Pro',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'application-name': 'NTET Pro',
    'apple-mobile-web-app-title': 'NTET Pro',
    'theme-color': '#64B5F6',
    'msapplication-navbutton-color': '#64B5F6',
    'apple-mobile-web-app-status-bar-style': 'default',
    'msapplication-starturl': '/',
  },
};

export const viewport: Viewport = {
  themeColor: '#64B5F6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/ntet-app/192/192" />
      </head>
      <body
        className={cn(
          'font-body antialiased min-h-screen bg-background',
          ptSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <AuthGuard>
              <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden">
                  <PWARegister />
                  <ContentProtection />
                  <AppSidebar />
                  <SidebarInset className="flex flex-col h-screen relative overflow-y-auto">
                    <NavHeader />
                    <main className="flex-1">
                      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 pb-4 md:pb-8">
                        {children}
                      </div>
                      <footer className="py-8 px-4 md:px-8 border-t bg-muted/20 text-center">
                        <div className="flex items-center justify-center gap-6 flex-wrap">
                          <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary underline transition-colors flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Privacy Policy
                          </Link>
                          <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary underline transition-colors flex items-center gap-1">
                            <Scale className="w-3 h-3" /> Terms & Conditions
                          </Link>
                          <Link href="/profile" className="text-xs text-muted-foreground hover:text-primary underline transition-colors">
                            Creator Profile
                          </Link>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-4 italic opacity-70">
                          Empowering NTET aspirants with focused Study Material.
                        </p>
                      </footer>
                    </main>
                  </SidebarInset>
                </div>
                <Toaster />
              </SidebarProvider>
            </AuthGuard>
          </FirebaseClientProvider>
        </ThemeProvider>
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}