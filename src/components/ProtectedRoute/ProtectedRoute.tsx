import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from 'hooks/useAppSelector';
import ClosedModal from 'components/ClosedModal';

import { getTodayScheduleWindow, isOutsideWorkTime } from 'src/utlis/timeUtils';

const isAuthenticated = (): boolean => {
  const venue = localStorage.getItem('venue');
  return venue !== null;
};


const ProtectedRoute = () => {
  // Hooks must be declared unconditionally
  const [showClosed, setShowClosed] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const authenticated = isAuthenticated();
  const venue = useAppSelector((s) => s.yourFeature.venue);
  const { window: todayWindow, isClosed } = getTodayScheduleWindow(venue?.schedules, venue?.schedule);
  const closed = isClosed || isOutsideWorkTime(todayWindow);
  const mainPage = localStorage.getItem('mainPage') || '/';
  const cartLength = useAppSelector((s) => s.yourFeature.cart.length);
  const location = useLocation();

  useEffect(() => {
    if (closed) {
      setShowClosed(true);
    }
  }, [closed]);

  // Redirect to main if not authenticated (no venue context)
  if (!authenticated) {
    return <Navigate to='/' replace />;
  }

  // Block /cart when cart is empty (desktop/mobile)
  if (location.pathname === '/cart' && cartLength === 0) {
    return <Navigate to={mainPage} replace />;
  }

  // Block access to protected content when closed: show modal and then redirect
  if (closed) {
    return (
      <>
        <ClosedModal
          isShow={showClosed}
          onClose={() => setRedirect(true)}
        />
        {redirect ? <Navigate to={mainPage} replace /> : null}
      </>
    );
  }

  // Otherwise allow access
  return <Outlet />;
};

export default ProtectedRoute;
