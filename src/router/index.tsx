'use client';

import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Loader from 'components/Loader';

const Cart = lazy(() => import('pages/Cart'));
const Deliver = lazy(() => import('pages/Deliver'));
const Home = lazy(() => import('pages/Home'));
const Main = lazy(() => import('pages/Main'));
const NotFound = lazy(() => import('pages/NotFound'));
const Order = lazy(() => import('pages/Order'));
const Scan = lazy(() => import('pages/Scan'));
const SelectOrderType = lazy(() => import('pages/SelectOrderType'));
const Takeaway = lazy(() => import('pages/Takeaway'));
const Terms = lazy(() => import('pages/Terms'));
const ProtectedRoute = lazy(() => import('components/ProtectedRoute'));


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/scan' element={<Scan />} />
          <Route path='/deliver/:venue' element={<Deliver />} />
          <Route path='/takeaway/:venue' element={<Takeaway />} />
          <Route path='/:venue' element={<SelectOrderType />} />
          <Route path='/:venue/d' element={<Home />} />
          <Route path='/:venue/:venueId/:id' element={<Home />} />
          <Route path='/I/:venue/d' element={<Home />} />
          <Route path='/I/:venue/:venueId/:id' element={<Home />} />

          <Route element={<ProtectedRoute />}>
            <Route path='/cart' element={<Cart />} />
          </Route>
          <Route path='/orders/:id' element={<Order />} />
          <Route path='/:venue/terms' element={<Terms />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
