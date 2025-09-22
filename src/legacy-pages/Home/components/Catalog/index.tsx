import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetProductsQuery } from 'api/Products.api';
import { IFoodCart, IProduct } from 'types/products.types';
import { useAppSelector } from 'hooks/useAppSelector';
import CatalogCard from 'components/Cards/Catalog';
import ClosedModal from 'components/ClosedModal';
import FoodDetail from 'components/FoodDetail';

import nothing from 'assets/images/not-found-products.png';

import './style.scss';

import { t } from 'i18next';
import { getTodayScheduleWindow, isOutsideWorkTime } from 'src/utlis/timeUtils';

interface IProps {
  searchText?: string;
  selectedCategory?: number;
  categoryTitle?: string;
}

const Catalog: FC<IProps> = ({ searchText, selectedCategory = 0, categoryTitle }) => {
  const { venue } = useParams();
  const [isShow, setIsShow] = useState(false);
  const [activeFood, setActiveFood] = useState<IProduct | null>(null);
  const [showClosed, setShowClosed] = useState(false);
  const cart = useAppSelector((state) => state.yourFeature.cart);
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const venueData = useAppSelector((state) => state.yourFeature.venue);
  const navigate = useNavigate();
  const { data: items, isLoading } = useGetProductsQuery({
    search: searchText,
    venueSlug: venue,
  });

  const baseItems = items ?? [];
  const filtered = selectedCategory
    ? baseItems.filter((p) => p?.category?.id === selectedCategory)
    : baseItems;

  const sortedItems = filtered.slice().sort((a, b) => {
    const ha =
      a.productPhoto || a.productPhotoSmall || a.productPhotoLarge ? 1 : 0;
    const hb =
      b.productPhoto || b.productPhotoSmall || b.productPhotoLarge ? 1 : 0;
    if (hb !== ha) return hb - ha;
    const an = (a.productName || '').localeCompare(b.productName || '');
    if (an !== 0) return an;
    return (a.id || 0) - (b.id || 0);
  });

  const handleClose = () => {
    setIsShow(false);
    document.body.style.height = '';
    document.body.style.overflow = '';
  };

  const handleOpen = (food: IProduct) => {
    setIsShow(true);
    setActiveFood(food);
    document.body.style.height = '100dvh';
    document.body.style.overflow = 'hidden';
  };

  function getCartItemPrice(item: IFoodCart): number {
    if (item.modificators?.price) {
      return item.modificators.price;
    }
    return item.productPrice;
  }

  const subtotal = cart.reduce((acc, item) => {
    const realPrice = getCartItemPrice(item);
    return acc + realPrice * item.quantity;
  }, 0);

  const closed = (() => {
    try {
      const { window, isClosed } = getTodayScheduleWindow(
        venueData?.schedules,
        venueData?.schedule
      );
      return isClosed || isOutsideWorkTime(window);
    } catch {
      return false;
    }
  })();

  return (
    <section className='catalog'>
      <ClosedModal isShow={showClosed} onClose={() => setShowClosed(false)} />
      <FoodDetail
        isShow={isShow}
        setIsShow={handleClose}
        item={
          activeFood || {
            category: { categoryName: '', id: 0 },
            productName: '',
            productPhoto: '',
            productPrice: 0,
            weight: 0,
            productDescription: '',
            isRecommended: false,
            productPhotoLarge: '',
            productPhotoSmall: '',
            modificators: [
              {
                id: 0,
                name: '',
                price: 0,
              },
            ],
            id: 0,
          }
        }
      />
      <h2>{categoryTitle || t('allDishes')}</h2>
      {isLoading ? (
        <div className='catalog__content'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='bg-white rounded-[12px] p-[12px]'>
              <div className='w-full h-[140px] bg-gray-200 animate-pulse rounded-[8px]' />
              <div className='mt-[8px] h-[16px] bg-gray-200 animate-pulse rounded' />
              <div className='mt-[6px] h-[14px] w-1/2 bg-gray-200 animate-pulse rounded' />
            </div>
          ))}
        </div>
      ) : sortedItems.length > 0 ? (
        <div className='catalog__content'>
          {sortedItems.map((item) => (
            <CatalogCard foodDetail={handleOpen} key={item.id} item={item} />
          ))}
          {window.innerWidth < 768 && cart.length !== 0 && (
            <div className='catalog__footer'>
              <button
                onClick={() => {
                  if (closed) {
                    setShowClosed(true);
                    return;
                  }
                  navigate('/cart');
                }}
                style={{ backgroundColor: colorTheme }}
              >
                {t('basket.order')}
                <span className='font-light absolute right-[30px]'>
                  {subtotal} с
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className='mt-[24px] flex flex-col items-center'>
          <h3 className='text-center text-[24px] font-semibold mb-[24px]'>
            Увы, ничего не найдено{'('}
          </h3>
          <img src={nothing} alt='' className='w-1/2' />
        </div>
      )}
    </section>
  );
};

export default Catalog;
