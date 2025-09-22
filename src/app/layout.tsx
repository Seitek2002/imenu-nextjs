import type { Metadata } from 'next';
import './globals.css';
import '../index.scss';
import '../App.scss';
import 'swiper/swiper-bundle.css';
import Providers from './providers';


export const metadata: Metadata = {
  title: 'iMenu.kg - ваше электронное меню!',
  description: 'iMenu.kg — ваше электронное меню!',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
