import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from 'hooks/useAppSelector';

import './index.scss';


interface ClosedModalProps {
  isShow: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

const ClosedModal: FC<ClosedModalProps> = ({
  isShow,
  onClose,
  title,
  description,
}) => {
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const { t } = useTranslation();

  return (
    <>
      <div className={isShow ? 'overlay active' : 'overlay'} onClick={onClose} />
      <div className={isShow ? 'closed-modal active' : 'closed-modal'}>
        <h3 className='title'>
          {title ?? t('closed.title')}
        </h3>
        <p className='desc'>
          {description ?? t('closed.description')}
        </p>
        <button
          style={{ backgroundColor: colorTheme }}
          className='action'
          onClick={onClose}
        >
          {t('closed.ok')}
        </button>
      </div>
    </>
  );
};

export default ClosedModal;
