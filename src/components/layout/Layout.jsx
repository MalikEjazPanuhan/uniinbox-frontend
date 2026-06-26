import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <Header />
        <main className="p-6 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
