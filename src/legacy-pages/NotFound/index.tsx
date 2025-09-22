import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppSelector } from 'hooks/useAppSelector';

import notFoundImg from 'assets/images/not-found-products.png';

import './style.scss';

type Props = {
  message?: string;
};

const NotFound: React.FC<Props> = ({ message }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const colorTheme =
    useAppSelector((s) => s.yourFeature.venue?.colorTheme) || '#00BFB2';

  const goHome = () => {
    if (params.venue) {
      navigate('/');
    } else {
      navigate('/');
    }
  };

  const tryAgain = () => {
    // Simple refresh retry
    window.location.reload();
  };

  return (
    <section className='notfound font-inter bg-[#F1F2F3] px-[16px] pt-[40px] lg:max-w-[1140px] lg:mx-auto'>
      <div className='notfound__card'>
        <img className='notfound__img' src={notFoundImg} alt='Not Found' />
        <h1 className='notfound__title'>{t('notFoundPage.title')}</h1>
        <p className='notfound__desc'>
          {message || (t('notFoundPage.description') as string)}
        </p>
        <div className='notfound__actions'>
          <button
            className='notfound__btn'
            style={{ backgroundColor: colorTheme }}
            onClick={goHome}
          >
            {t('notFoundPage.goHome')}
          </button>
          <button
            className='notfound__btn outline'
            style={{ color: colorTheme, borderColor: colorTheme }}
            onClick={tryAgain}
          >
            {t('notFoundPage.tryAgain')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
