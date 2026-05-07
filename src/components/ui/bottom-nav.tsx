import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2 } from 'lucide-react';

export default function BottomNav() {
  const { pathname } = useLocation();
  const items = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/stats', icon: BarChart2, label: 'Stats' },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-950/90 backdrop-blur-md border-t border-gray-800 sm:hidden pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex">
        {items.map(({ to, icon: Icon, label }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors ${
                isActive ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className={isActive ? 'bg-blue-500/15 rounded-xl px-3 py-1.5 flex flex-col items-center gap-1' : 'flex flex-col items-center gap-1'}>
                <Icon size={20} />
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
