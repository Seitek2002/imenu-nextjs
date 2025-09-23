import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useGetClientBonusQuery } from 'api/Client.api';
import { useGetVenueQuery } from 'api/Venue.api';
 // import { useAppSelector } from 'hooks/useAppSelector';
 // import check from 'assets/icons/SubHeader/check.svg';
 // import logo from 'assets/images/SubHeader/logo.png';
import WeeklyScheduleModal from 'components/WeeklyScheduleModal';

const calendarIcon = '/assets/icons/SubHeader/calendar.svg';
const bellIcon = '/assets/icons/SubHeader/coin.png';

import './style.scss';

import { clearCart, setVenue } from 'src/store/yourFeatureSlice';
import { loadUsersDataFromStorage,loadVenueFromStorage } from 'src/utlis/storageUtils';
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

  // Fetch dynamic client bonus (same as static points usage)
  const phoneForBonus = (() => {
    try {
      const u = loadUsersDataFromStorage();
      return (u?.phoneNumber || '').trim();
    } catch {
      return '';
    }
  })();
  const { data: bonusData } = useGetClientBonusQuery(
    { phone: phoneForBonus, venueSlug: data?.slug || venue },
    { skip: !phoneForBonus || !(data?.slug || venue) }
  );

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
    const loadedVenue = loadVenueFromStorage();

    if (loadedVenue.companyName !== venue) {
      dispatch(clearCart());
    }

    // if(venueData.activeSpot !== location.pathname.split('/').filter((item) => +item)[0]) {

    // }
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
            <span className='text-[14px] font-bold text-center flex items-center gap-[8px]'>
              <Image src={bellIcon} alt='' width={20} height={20} />
              <span className='mt-[4px] text-[10px] md:text-[14px]'>{bonusData?.bonus ?? 0} <span className='hidden md:inline'>б.</span></span>
            </span>
          </div>
          <div
            className='call cursor-pointer'
            role='button'
            aria-label='График работы'
            onClick={() => setIsScheduleOpen(true)}
          >
            <Image src={calendarIcon} alt='График работы' width={20} height={20} />
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
