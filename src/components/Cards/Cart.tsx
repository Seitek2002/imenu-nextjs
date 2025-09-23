import { FC, useState } from 'react';
import Image from 'next/image';

import { IFoodCart } from 'types/products.types';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';

import minus from 'assets/icons/Busket/minus.svg?url';
import plus from 'assets/icons/Busket/plus.svg?url';

import { addToCart, incrementFromCart } from 'src/store/yourFeatureSlice';

interface IProps {
  item: IFoodCart;
}

const BusketCard: FC<IProps> = ({ item }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );

  const increment = () => {
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  const decrement = () => {
    dispatch(incrementFromCart(item));
  };

  return (
    <div className='busket-card'>
      <div className='busket-card__img-wrapper'>
        {!isLoaded && (
          <div className='cart-img-skeleton absolute top-0 left-0 w-full h-full bg-gray-300 animate-pulse'></div>
        )}
        <Image
          src={item.productPhoto && item.productPhoto.trim() ? item.productPhoto : '/assets/images/default-product.svg'}
          alt=''
          width={80}
          height={80}
          onLoadingComplete={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <div className='busket-card__text'>
        <h3>{item.productName}</h3>
        <div className='flex items-center'>
          <span className='price' style={{ color: colorTheme }}>
            {item.modificators ? item.modificators.price : +item.productPrice} с
          </span>
          {item.modificators?.name && (
            <span className='weight mx-[5px]'> | </span>
          )}
          {item.modificators?.name && (
            <span className='weight'>{item.modificators.name}</span>
          )}
        </div>
      </div>
      <div className='busket-card__counter'>
        <Image onClick={decrement} src={minus} alt='' width={16} height={16} />
        <span>{item.quantity}</span>
        <Image onClick={increment} src={plus} alt='' width={16} height={16} />
      </div>
    </div>
  );
};

export default BusketCard;
