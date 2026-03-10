import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PlayerModal from '../ui/PlayerModal';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <PlayerModal />
      <main className="flex-1 pt-[70px] max-md:pt-[60px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
