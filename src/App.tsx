import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import Store from './pages/Store/Store';
import Ranks from './pages/Ranks/Ranks';
import Wiki from './pages/Wiki/Wiki';
import Support from './pages/Support/Support';
import Cart from './pages/Cart/Cart';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="store" element={<Store />} />
              <Route path="ranks" element={<Ranks />} />
              <Route path="wiki" element={<Wiki />} />
              <Route path="support" element={<Support />} />
              <Route path="cart" element={<Cart />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
