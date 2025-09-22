'use client';

import Head from 'next/head';
import { useAppSelector } from 'hooks/useAppSelector';
import { RootState } from '@/store';
import { useLocation } from 'react-router-dom';

const MetaHead = () => {
  const venue = useAppSelector((s: RootState) => s.yourFeature.venue);
  const location = useLocation();
  const isRoot = location.pathname === '/';
  const title = isRoot ? 'imenu' : (venue?.companyName || 'imenu');
  const desc =
    (venue?.description && venue.description.trim()) ||
    (venue?.companyName
      ? `${venue.companyName} — онлайн-меню и заказы`
      : 'iMenu — онлайн-меню и заказы');
  const faviconHref = isRoot ? '/favicon.svg' : (venue?.logo || '/favicon.svg');

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      {!isRoot && venue?.logo ? (
        <meta property="og:image" content={venue.logo} />
      ) : null}
      {/* На корне оставляем дефолтный favicon из index.html (data:svg), не переопределяем */}
      <link rel="icon" href={faviconHref} />
    </Head>
  );
};

export default MetaHead;
