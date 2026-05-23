import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '乡音留痕·岁月永存 - 乡村老人数字回忆录平台',
  description: 'AI赋能乡村老人记忆留存，智能访谈、数字人生成、声音存档，让每一位乡村老人的故事永久流传',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
