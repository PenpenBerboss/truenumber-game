import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'TrueNumber - Ultimate Number Guessing Game',
  description: 'A modern number guessing game with beautiful UI and real-time scoring',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
            <body className="font-sans">
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'linear-gradient(145deg, #1e1e2f, #16213e)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                backdropFilter: 'blur(20px)',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}