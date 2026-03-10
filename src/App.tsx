import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Layout from './components/layout/Layout';

const Home = lazy(() => import('./pages/Home/Home'));
const Store = lazy(() => import('./pages/Store/Store'));
const Ranks = lazy(() => import('./pages/Ranks/Ranks'));
const Wiki = lazy(() => import('./pages/Wiki/Wiki'));
const Support = lazy(() => import('./pages/Support/Support'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Admin = lazy(() => import('./pages/Admin/Admin'));

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <PlayerProvider>
          <AuthProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="store" element={<Store />} />
                    <Route path="ranks" element={<Ranks />} />
                    <Route path="wiki" element={<Wiki />} />
                    <Route path="support" element={<Support />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="admin" element={<Admin />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </PlayerProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
