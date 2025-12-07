import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'LTU Moodle Builder',
  description: 'Web application for creating HTML components for Moodle LMS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-background text-primary">
      <Header />

      <main className='flex flex-grow'>
        {children}
      </main>
 
      <Footer />
      <Toaster position="bottom-right" richColors duration={1500}/>
      </body>
    </html>
  );
}