import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'DocForge | Document Preparation',
  description: 'Generate premium BRD, SRD, and Business Proposals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark-theme" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (localStorage.getItem('docforge_theme') === 'light') {
                document.body.classList.remove('dark-theme');
              }
            } catch(e) {}
          `
        }} />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
