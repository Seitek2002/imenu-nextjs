import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector } from 'hooks/useAppSelector';
import BusketCard from 'components/Cards/Cart';
import ClosedModal from 'components/ClosedModal';

import './style.scss';

import { getTodayScheduleWindow, isOutsideWorkTime } from 'src/utlis/timeUtils';

const BusketDesktop = ({
  to,
  createOrder,
  disabled,
}: {
  createOrder?: () => void;
  to: string;
  disabled?: boolean;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const venueData = useAppSelector((state) => state.yourFeature.venue);
  const cart = useAppSelector((state) => state.yourFeature.cart);
  const location = useLocation();
  const isOnCart = location.pathname === '/cart';
  const isNavigatingToCart = !isOnCart && to === '/cart';
  const buttonText = isNavigatingToCart ? 'Оформить заказ' : t('button.next');
  const isDisabled =
    (disabled ?? false) || (isNavigatingToCart && cart.length === 0);

  const [showClosed, setShowClosed] = useState(false);

  const { window: todayWindow, isClosed } = getTodayScheduleWindow(
    venueData?.schedules,
    venueData?.schedule
  );
  const closed = isClosed || isOutsideWorkTime(todayWindow);

  const handleClick = () => {
    if (isDisabled) return;
    if (closed) {
      setShowClosed(true);
      return;
    }
    if (location.pathname === '/cart') {
      if (createOrder) createOrder();
    } else {
      navigate(to);
    }
  };

  return (
    <>
      <div className='busket__content'>
        <ClosedModal isShow={showClosed} onClose={() => setShowClosed(false)} />
        {venueData?.table?.tableNum && (
          <div className='table-num'>
            {venueData.table.tableNum}
          </div>
        )}
        {cart.length > 0 ? (
          <>
            {cart.map((item) => (
              <BusketCard key={item.id} item={item} />
            ))}
          </>
        ) : (
          <div className='busket__empty text-center'>
            {t('basket.addItems')}
          </div>
        )}
      </div>
      <hr />
      <div className='bg-[#fff] p-[12px]'>
        <button
          style={{ backgroundColor: colorTheme }}
          onClick={handleClick}
          disabled={isDisabled}
        >
          {buttonText}
        </button>
      </div>
    </>
  );
};

export default BusketDesktop;
