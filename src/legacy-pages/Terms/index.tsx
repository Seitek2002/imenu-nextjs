import { useMemo } from 'react';
import Image from 'next/image';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetVenueQuery } from 'api/Venue.api';
import { useAppSelector } from 'hooks/useAppSelector';


const TermsPage = () => {
  const { venue } = useParams();
  const navigate = useNavigate();

  // Fetch venue by slug to ensure we have fresh 'terms' even on direct navigation
  const { data } = useGetVenueQuery({
    venueSlug: venue || '',
  });

  // Fallback to Redux store if API not yet resolved
  const venueState = useAppSelector((s) => s.yourFeature.venue);

  const termsHtml = useMemo(() => {
    return (data?.terms ?? venueState?.terms ?? '') || '';
  }, [data?.terms, venueState?.terms]);

  return (
    <section className='relative font-inter bg-[#F1F2F3] px-[16px] pt-[16px] lg:max-w-[1140px] lg:mx-auto min-h-screen'>
      <header className='flex items-center justify-between bg-white rounded-[12px] px-[12px] py-[10px]'>
        <Image
          src='/assets/icons/Busket/header-arrow.svg'
          alt='Назад'
          width={24}
          height={24}
          onClick={() => navigate(-1)}
          className='cursor-pointer'
        />
        <h3 className='text-[16px] font-semibold'>Условия</h3>
        <div />
      </header>

      <div className='mt-[12px] bg-white rounded-[12px] p-[16px]'>
        {termsHtml ? (
          <div
            className='prose prose-sm max-w-none terms-content'
            style={{ color: '#222' }}
            // Backend returns trusted HTML for venue terms
            dangerouslySetInnerHTML={{ __html: termsHtml }}
          />
        ) : (
          <div className='text-gray-500'>Нет данных</div>
        )}
      </div>

      <footer className='h-[24px]' />
    </section>
  );
};

export default TermsPage;
