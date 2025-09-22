import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Header from 'components/Header';
import Loader from 'components/Loader';
import SupHeader from 'components/SubHeader';

import clearCartIcon from 'assets/icons/Busket/clear-cart.svg';

import { loadUsersDataFromStorage } from 'src/utlis/storageUtils';

const Catalog = lazy(() => import('./components/Catalog'));
const Categories = lazy(() => import('./components/Categories'));
const Search = lazy(() => import('./components/Search'));
const BusketDesktop = lazy(() => import('components/BusketDesktop'));
const ClearCartModal = lazy(() => import('components/ClearCartModal'));
const Hero = lazy(() => import('components/Hero'));


const Home = () => {
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const [active, setActive] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );
  const catalogRef = useRef<HTMLDivElement>(null);
  const [search, onSearch] = useState(false);
  const userData = loadUsersDataFromStorage();
  const { t } = useTranslation();
  const [categoryTitle, setCategoryTitle] = useState<string>(t('allDishes'));
  const clearCartHandler = () => {
    setActive(!active);
  };

  const onSearchChange = (bool: boolean) => {
    onSearch(bool);
    document.body.style.overflow = bool ? 'hidden' : '';
    window.scrollTo(0, 0);
    // When closing search, reset selection to "All"
    if (!bool) {
      setSelectedCategory(0);
      setCategoryTitle(t('allDishes'));
    }
  };

  const handleCategoryChange = (categoryId?: number) => {
    setSelectedCategory(categoryId);
    catalogRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    localStorage.setItem('mainPage', location.pathname);

    localStorage.setItem(
      'users',
      JSON.stringify({
        ...userData,
        activeSpot: +location.pathname.split('/').filter((item) => +item)[0],
      })
    );
    console.log(JSON.parse(localStorage.getItem('users') ?? '{}'));
  }, []);

  return (
    <div className='relative font-inter bg-[#F1F2F3] px-[16px] pt-[12px] lg:max-w-[1140px] lg:mx-auto'>
      <Suspense fallback={<Loader />}>
        <ClearCartModal isShow={active} setActive={setActive} />
      </Suspense>
      <div className='bg-white rounded-[12px] p-[12px]'>
        <Header searchText={searchText} setSearchText={setSearchText} />
        <hr className='my-[10px]' />
        <SupHeader />
      </div>
      {window.innerWidth < 768 ? (
        <>
          {search && (
            <Suspense fallback={<Loader />}>
              <Search
                onSearchChange={onSearchChange}
                searchText={searchText}
                setSearchText={setSearchText}
              />
            </Suspense>
          )}
          <Suspense fallback={<Loader />}>
            <Hero />
          </Suspense>
          <Suspense fallback={<Loader />}>
            <Categories
              onCategoryChange={handleCategoryChange}
              onSearchChange={onSearchChange}
              selectedCategory={selectedCategory ?? 0}
              onCategoryTitleChange={(title) => setCategoryTitle(title)}
            />
          </Suspense>
          <div ref={catalogRef} className='pb-[100px]'>
            <Suspense fallback={<Loader />}>
              <Catalog
                selectedCategory={selectedCategory}
                categoryTitle={categoryTitle}
              />
            </Suspense>
          </div>
        </>
      ) : (
        <div className='flex gap-[30px] items-start pb-[50px] w-full'>
          <div className='w-[60%]'>
            <Suspense fallback={<Loader />}>
              <Hero />
            </Suspense>
            <Suspense fallback={<Loader />}>
              <Categories
                onCategoryChange={handleCategoryChange}
                onSearchChange={onSearchChange}
                selectedCategory={selectedCategory ?? 0}
                onCategoryTitleChange={(title) => setCategoryTitle(title)}
              />
            </Suspense>
            <Suspense fallback={<Loader />}>
              <Catalog
                searchText={searchText}
                selectedCategory={selectedCategory}
                categoryTitle={categoryTitle}
              />
            </Suspense>
          </div>
          <div className='flex-1 sticky top-0 z-[1]'>
            <div className='busket'>
              <header className='busket__header'>
                <h2>{t('basket.title')}</h2>
                <img
                  onClick={clearCartHandler}
                  src={clearCartIcon}
                  alt=''
                  className='cursor-pointer'
                />
              </header>
              <Suspense fallback={<Loader />}>
                <BusketDesktop to='/cart' />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
