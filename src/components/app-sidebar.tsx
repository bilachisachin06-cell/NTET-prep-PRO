"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  GraduationCap,
  LayoutDashboard,
  BookCopy,
  NotebookText,
  ClipboardCheck,
  User,
  Info,
  ShieldCheck,
  LogOut,
  LogIn,
  Crown,
  BarChart3,
  Zap,
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback } from './ui/avatar';
import { doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/syllabus', label: 'Syllabus', icon: BookCopy },
  { href: '/notes', label: 'Study Material', icon: NotebookText },
  { href: '/smart-practice', label: 'Smart Practice', icon: Zap },
  { href: '/tests', label: 'Mock Tests & PYPs', icon: ClipboardCheck },
  { href: '/progress', label: 'My Progress', icon: BarChart3 },
  { href: '/about', label: 'About App', icon: Info },
  { href: '/profile', label: 'Creator Profile', icon: User },
  { href: '/privacy', label: 'Privacy Policy', icon: ShieldCheck },
];

export function AppSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userData } = useDoc(userRef);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/auth');
  };

  const hasFullAccess = user?.email === 'bilachisachin06@gmail.com';
  
  const isPro = mounted && (hasFullAccess || (userData?.subscriptionStatus === 'pro' && (
    !userData.subscriptionExpiresAt || new Date(userData.subscriptionExpiresAt) > new Date()
  )));

  if (pathname === '/auth') return null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-semibold tracking-tight font-headline leading-none truncate">
              NTET Prep Pro
            </h2>
            <p className="text-[10px] font-black tracking-tight mt-1 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-600">SUGAM ವಿಜ್ಞಾನ</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className="justify-start"
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 flex flex-col gap-4">
        {user ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-sidebar-border shadow-sm mb-2 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:justify-center relative">
            {isPro && (
              <div className="absolute -top-2 -right-1 group-data-[collapsible=icon]:hidden">
                <div className="bg-primary text-primary-foreground text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Crown className="w-2 h-2" /> PRO
                </div>
              </div>
            )}
            <Avatar className="h-8 w-8 border border-primary/20 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="text-xs font-bold text-foreground truncate">{user.displayName || 'Learner'}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive group-data-[collapsible=icon]:hidden" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="mb-2 px-1 group-data-[collapsible=icon]:px-0">
            <Button asChild className="w-full justify-start gap-2 group-data-[collapsible=icon]:px-2" variant="outline">
              <Link href="/auth">
                <LogIn className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Sign In</span>
              </Link>
            </Button>
          </div>
        )}

        <div className="flex items-center w-full group-data-[collapsible=icon]:justify-center">
          <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:ml-0" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
