import { FC, useEffect, useState } from 'react';

import { useAppSelector } from 'hooks/useAppSelector';

import './index.scss';

type Props = {
  isShow: boolean;
  onCancel: () => void;
  onConfirm: (code: string) => void;
};

const OtpModal: FC<Props> = ({ isShow, onCancel, onConfirm }) => {
  const colorTheme = useAppSelector((s) => s.yourFeature.venue?.colorTheme) || '#00BFB2';
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (isShow) setCode('');
  }, [isShow]);

  const handleOk = () => {
    const trimmed = (code || '').trim();
    onConfirm(trimmed);
  };

  return (
    <>
      <div className={isShow ? 'overlay active' : 'overlay'} onClick={onCancel} />
      <div className={isShow ? 'otp-modal active' : 'otp-modal'}>
        <h3 className="title">Введите SMS-код</h3>
        <div className="content">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Код из SMS"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="hint">На ваш номер отправлен одноразовый код подтверждения.</div>
        </div>
        <div className="actions">
          <button className="cancel" onClick={onCancel}>Отмена</button>
          <button className="ok" style={{ backgroundColor: colorTheme }} onClick={handleOk}>Подтвердить</button>
        </div>
      </div>
    </>
  );
};

export default OtpModal;
