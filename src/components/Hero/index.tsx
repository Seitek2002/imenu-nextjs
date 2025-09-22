import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { statusMessages } from 'pages/Order/enums';
import { IBanner, useGetBannersQuery } from 'api/Banners.api';
import { useGetOrdersQuery } from 'api/Orders.api';
import { IOrder } from 'types/orders.types';

// import Loader from 'components/Loader';
const offer1 = '/assets/images/OrderStatus/Offer-1.png';
const offer2 = '/assets/images/OrderStatus/Offer-2.png';
const offer3 = '/assets/images/OrderStatus/schedule-status.png';

import './style.scss';

import { getTodayScheduleWindow, isOutsideWorkTime } from 'src/utlis/timeUtils';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';


const Hero = () => {
  const user = JSON.parse(localStorage.getItem('users') ?? '{}');
  const venue = JSON.parse(localStorage.getItem('venue') ?? '{}');
  const navigate = useNavigate();

  const {
    data: fetchedBanners,
    isError: bannersError,
  } = useGetBannersQuery({ venueSlug: venue.slug });

  const { data: fetchedOrders } = useGetOrdersQuery({
    phone: `${user.phoneNumber}`,
    venueSlug: venue.slug,
  });
  const { t } = useTranslation();

  const closed = (() => {
    try {
      const { window, isClosed } = getTodayScheduleWindow(venue?.schedules, venue?.schedule);
      return isClosed || isOutsideWorkTime(window);
    } catch {
      return false;
    }
  })();

  const [orders, setOrders] = useState<IOrder[] | undefined>([]);

  const getStatusData = (serviceMode: number, status: number) => {
    if (!statusMessages[serviceMode]) {
      return {
        text: 'Ожидайте, заказ обрабатывается.',
        color: 'text-orange-500',
      };
    }

    const statusObj =
      statusMessages[serviceMode][status] || statusMessages[serviceMode][0];

    let colorClass = 'text-orange-500';
    if (status === 1) {
      colorClass = 'text-green-500';
    } else if (status === 7) {
      colorClass = 'text-red-500';
    }

    return {
      text: statusObj.title.text,
      color: colorClass,
    };
  };

  useEffect(() => {
    if (fetchedOrders) {
      setOrders(fetchedOrders);
    }
  }, [fetchedOrders]);

  const ws = new WebSocket(
    `wss://imenu.kg/ws/orders/?phone_number=${user.phoneNumber}`
  );

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    const data: { order_id: number; status: number; status_text: string } =
      JSON.parse(event.data);
    setOrders((prevOrders) =>
      prevOrders?.map((order) =>
        order.id === data.order_id
          ? { ...order, status: data.status, statusText: data.status_text }
          : order
      )
    );
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };

  const handleOrderClick = (orderId: number | undefined) => {
    navigate(`/orders/${orderId}`);
  };

  const handleBannerClick = (url: string | undefined) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <section className='hero'>
      {bannersError && <p>{t('banner.error')}</p>}
      {/* {bannersLoading && <Loader />} */}

      <Swiper
        pagination={{ dynamicBullets: true }}
        modules={[Pagination]}
        className='hero-swiper'
      >
        {closed && (
          <SwiperSlide>
            <div
              className='hero__item'
              style={{
                backgroundImage: `url(${offer3})`,
              }}
            >
              <p
                className={`text-base md:text-[32px] max-w-[60%] font-bold text-[#a9a9a9]`}
              >
                Сейчас нерабочее время
              </p>
            </div>
          </SwiperSlide>
        )}

        {orders?.map((order) => {
          const { color } = getStatusData(order.serviceMode, order.status);

          return (
            <SwiperSlide key={`order-${order.id}`}>
              <div
                onClick={() => handleOrderClick(order.id)}
                className='hero__item'
                style={{
                  backgroundImage: `url(${
                    order.status === 0 ? offer1 : offer2
                  })`,
                }}
              >
                <span>Заказ №{order.id}</span>
                <p
                  className={`text-base md:text-[32px] max-w-[60%] font-bold ${color}`}
                >
                  {order.statusText}
                </p>
              </div>
            </SwiperSlide>
          );
        })}

        {fetchedBanners?.map((banner: IBanner) => (
          <SwiperSlide key={`banner-${banner.id}`}>
            <div
              className='hero__item banner__item cursor-pointer'
              onClick={() => handleBannerClick(banner.url)}
            >
              <Image
                src={banner.image && banner.image.trim() ? banner.image : '/assets/images/default-product.svg'}
                alt={banner.title || 'banner'}
                width={800}
                height={360}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
