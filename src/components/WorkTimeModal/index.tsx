import { FC } from 'react';

import ClosedModal from 'components/ClosedModal';

type Props = {
  isShow: boolean;
  onClose: () => void;
};

const WorkTimeModal: FC<Props> = ({ isShow, onClose }) => {
  // Reuse ClosedModal which already shows localized "closed" texts and venue schedule
  return <ClosedModal isShow={isShow} onClose={onClose} />;
};

export default WorkTimeModal;
