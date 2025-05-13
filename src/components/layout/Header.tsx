import Link from 'next/link';
import VirtuFitLogo from '@/components/icons/VirtuFitLogo';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <VirtuFitLogo className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl tracking-tight">VirtuFit</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          <Link href="/" legacyBehavior passHref>
            <Button variant="ghost" asChild><a>Home</a></Button>
          </Link>
          <Link href="/outfits" legacyBehavior passHref>
            <Button variant="ghost" asChild><a>Outfits</a></Button>
          </Link>
        </nav>
        {/* Placeholder for potential user actions / dark mode toggle */}
        {/* <div className="flex items-center space-x-2">
          <Button variant="outline">Login</Button>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
