import type { Metadata } from 'next';
import { Inter, Noto_Serif_SC } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const notoSerif = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: '乡音留痕·岁月永存 - 乡村老人数字回忆录平台',
  description: 'AI赋能乡村老人记忆留存，智能访谈、数字人生成、声音存档，让每一位乡村老人的故事永久流传',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${notoSerif.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
