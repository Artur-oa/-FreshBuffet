import { Outlet } from 'react-router';
import Header from '../widgets/Header/Header';
import Footer from '../widgets/Footer/Footer';

export default function Root({ user, setUser }) {
  return (
    <div className='flex flex-col min-h-screen overflow-x-hidden bg-gradient-to-br from-orange-100 via-lime-100 to-green-100'>
      <Header user={user} setUser={setUser} />
      <main className='flex-1 flex flex-col w-full max-w-full overflow-x-hidden'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
