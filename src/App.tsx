import { Suspense } from 'react';

import AppRoutes from './router';
import { useGetClientBonusQuery } from 'api/Client.api';
import { useAppSelector } from 'hooks/useAppSelector';
import Loader from 'components/Loader';

import './App.scss';

import { loadUsersDataFromStorage } from 'src/utlis/storageUtils';

function App() {
  const usersPhone = useAppSelector(
    (state) => state.yourFeature.usersData?.phoneNumber
  );

  // Prefetch client bonus via RTK Query hook (cached in store)
  const storedPhone = (loadUsersDataFromStorage()?.phoneNumber || '').trim();
  const phone = (usersPhone || storedPhone).trim();
  const venueSlug = useAppSelector((state) => state.yourFeature.venue?.slug);
  useGetClientBonusQuery({ phone, venueSlug }, { skip: !phone || !venueSlug });

  return (
    <Suspense fallback={<Loader />}>
      <AppRoutes />
    </Suspense>
  );
}

export default App;
