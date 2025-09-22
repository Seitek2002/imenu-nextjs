'use client';

import { Suspense } from 'react';
import AppRoutes from '@/router';
import { useGetClientBonusQuery } from '@/api/Client.api';
import { useAppSelector } from '@/hooks/useAppSelector';
import Loader from '@/components/Loader';
import { loadUsersDataFromStorage } from '@/utlis/storageUtils';
import { RootState } from '@/store';

export default function LegacyApp() {
  const usersPhone = useAppSelector((state: RootState) => state.yourFeature.usersData?.phoneNumber);
  const storedPhone = (loadUsersDataFromStorage()?.phoneNumber || '').trim();
  const phone = (usersPhone || storedPhone).trim();
  const venueSlug = useAppSelector((state: RootState) => state.yourFeature.venue?.slug) || 'USTUKAN';

  useGetClientBonusQuery({ phone, venueSlug }, { skip: !phone || !venueSlug });

  return (
    <Suspense fallback={<Loader />}>
      <AppRoutes />
    </Suspense>
  );
}
