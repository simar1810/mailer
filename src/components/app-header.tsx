import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Mail className="h-8 w-8 mr-3 text-accent" />
        <Link href="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
          MailSenderPro
        </Link>
      </div>
    </header>
  );
}
