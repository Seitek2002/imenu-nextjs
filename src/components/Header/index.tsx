import { FC, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from 'hooks/useAppSelector';

const arrowIcon = '/assets/icons/Header/arrow.svg';
const searchIcon = '/assets/icons/Header/search.svg';

import './style.scss';

const LANGUAGES = ['RU', 'KG', 'ENG'];
const LANGUAGE_MAP: Record<string, string> = {
  ru: 'RU',
  kg: 'KG',
  en: 'ENG',
};

interface IProps {
  searchText: string;
  setSearchText?: (text: string) => void;
}

const Header: FC<IProps> = ({ searchText, setSearchText }) => {
  const { i18n } = useTranslation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const activeLang = useMemo(
    () => LANGUAGE_MAP[i18n.language] || 'RU',
    [i18n.language]
  );
  const { t } = useTranslation();
  const colorTheme =
    useAppSelector((s) => s.yourFeature.venue?.colorTheme) || '#FD0151';
  const toggleLanguageMenu = () => setIsLanguageOpen((prev) => !prev);

  const selectLanguage = (language: string) => {
    const langCode = language === 'RU' ? 'ru' : language === 'KG' ? 'kg' : 'en';
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
    setIsLanguageOpen(false);

    if (navigator.vibrate) navigator.vibrate(50);
    window.location.reload();
  };

  return (
    <header className='header'>
      <div className='header__content'>
        <div className='logo'>
          <svg
            width='32'
            height='32'
            viewBox='0 0 32 32'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            role='img'
            aria-label='iMenu Logo'
          >
            <rect width='32' height='32' rx='16' fill={colorTheme} />
            <path d='M21.4976 18.7638C21.4976 17.2393 20.9184 15.7773 19.8874 14.6993C18.8564 13.6214 17.458 13.0158 16 13.0158C14.5419 13.0158 13.1436 13.6214 12.1125 14.6993C11.0815 15.7773 10.5023 17.2393 10.5023 18.7638L21.4976 18.7638Z' fill='white' />
            <path d='M9.49805 19.1133H22.5021V20.8635H9.49805V19.1133Z' fill='white' />
            <path d='M16.8561 11.9399C16.8561 12.3836 16.4711 12.7433 15.9963 12.7433C15.5215 12.7433 15.1365 12.3836 15.1365 11.9399C15.1365 11.4962 15.5215 11.1365 15.9963 11.1365C16.4711 11.1365 16.8561 11.4962 16.8561 11.9399Z' fill='white' />
          </svg>
          <span>iMenu.kg</span>
        </div>

        {setSearchText && (
          <label htmlFor='search' className='header__search bg-[#F9F9F9]'>
            <Image src={searchIcon} alt='Search' width={16} height={24} />
            <input
              type='text'
              placeholder={t("search")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value.trim())}
              id='search'
            />
          </label>
        )}

        <div className='language'>
          <button
            className={`language-selected bg-gray-100 ${
              isLanguageOpen ? 'active' : ''
            }`}
            onClick={toggleLanguageMenu}
          >
            {activeLang} <Image src={arrowIcon} alt='Toggle Language' width={12} height={12} />
          </button>

          <div
            className={`language__wrapper bg-gray-100 ${
              isLanguageOpen ? 'active' : ''
            }`}
          >
            {LANGUAGES.filter((lang) => lang !== activeLang).map((lang) => (
              <button
                key={lang}
                className='language__item text-gray-900 cursor-pointer'
                onClick={() => selectLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
