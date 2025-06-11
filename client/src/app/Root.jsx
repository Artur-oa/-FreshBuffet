import { Outlet } from 'react-router';
import Header from '../widgets/Header/Header';
import Footer from '../widgets/Footer/Footer';

export default function Root({ user, setUser }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-lime-100 to-green-100 text-gray-800">
      <Header user={user} setUser={setUser} />
      <main className="p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
