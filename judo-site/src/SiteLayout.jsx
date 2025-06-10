import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { Outlet } from 'react-router-dom';

const SiteLayout = () => (
  <>
    <Header />
    <main className="main-content">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default SiteLayout; 