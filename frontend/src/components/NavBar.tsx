'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/listings" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          🏠 RealEstate
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/listings">
            <Button variant="ghost" size="sm">Listings</Button>
          </Link>
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user.username}
                {user.isAdmin && (
                  <Badge variant="secondary" className="ml-2">Admin</Badge>
                )}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
