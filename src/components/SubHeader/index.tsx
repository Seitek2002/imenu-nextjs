import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useGetVenueQuery } from 'api/Venue.api';
// import { useAppSelector } from 'hooks/useAppSelector';
// import check from 'assets/icons/SubHeader/check.svg';
// import logo from 'assets/images/SubHeader/logo.png';
import WeeklyScheduleModal from 'components/WeeklyScheduleModal';

const calendarIcon = '/assets/icons/SubHeader/calendar.svg';
const bellIcon = '/assets/icons/SubHeader/bell.svg';

import './style.scss';

import { clearCart, setVenue } from 'src/store/yourFeatureSlice';
import { loadVenueFromStorage } from 'src/utlis/storageUtils';
import { getTodayScheduleRangeString } from 'src/utlis/timeUtils';
import { formatSchedule } from 'src/utlis/workTime';

const SubHeader = () => {
  const { venue, id } = useParams();
  const dispatch = useDispatch();
  // const venueData = useAppSelector((state) => state.yourFeature.venue);
  const { data } = useGetVenueQuery({
    venueSlug: venue || '',
    tableId: Number(id) || undefined,
  });

  const navigate = useNavigate();

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const scheduleShort = (() => {
    try {
      const range = getTodayScheduleRangeString(
        data?.schedules,
        data?.schedule
      );
      return range ? formatSchedule(range) : '';
    } catch {
      return '';
    }
  })();

  useEffect(() => {
    if (data) dispatch(setVenue(data));
  }, [data, dispatch]);

  useEffect(() => {
    const { companyName } = loadVenueFromStorage();

    if (companyName.toLowerCase() !== venue) {
      dispatch(clearCart());
    }
  }, []);

  return (
    <div className='sub-header'>
      <div className='sub-header__content'>
        <div
          className='venue cursor-pointer'
          onClick={() => navigate(`/${venue || data?.slug || ''}/terms`)}
        >
          <div className='logo'>
            <Image
              src={data?.logo || '/assets/images/SubHeader/logo.png'}
              alt={data?.companyName || 'Venue logo'}
              width={44}
              height={44}
            />
          </div>
          <div>
            <div className='name'>{data?.companyName}</div>
            <span className='schedule'>{scheduleShort}</span>
          </div>
        </div>
        <div className='flex items-center justify-between md:gap-[12px] md:flex-initial'>
          <div className='call'>
            <Image width={16} height={16} src={bellIcon} alt='' />
            <span className='hidden md:inline'>Позвать официанта</span>
          </div>
          <div
            className='call cursor-pointer'
            role='button'
            aria-label='График работы'
            onClick={() => setIsScheduleOpen(true)}
          >
            <Image
              src={calendarIcon}
              alt='График работы'
              width={20}
              height={20}
            />
          </div>
          {/* {data?.table?.tableNum && (
            <div className='call'>
              <img src={bell} alt='' />
              <span className='hidden md:inline'>Позвать официанта</span>
            </div>
          )}
          {
            data?.table?.tableNum ? (
              <div className='check'>
                <img src={check} alt='' />
                <span className='hidden md:inline'>Чек</span>
              </div>
            ) : (
              <div className='check'>
                <img src={check} alt='' />
                <span>Чек</span>
              </div>
            )
          } */}
          {data?.table?.tableNum && (
            <div className='table'>{data.table.tableNum}</div>
          )}
        </div>
      </div>
      <WeeklyScheduleModal
        isShow={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        schedules={data?.schedules}
        fallbackSchedule={data?.schedule}
      />
    </div>
  );
};

export default SubHeader;
