import { Link, useLocation } from 'react-router-dom';

export default function TopNav() {
  const { pathname } = useLocation();
  const links = [
    { to: '/', label: 'Home' },
    { to: '/stats', label: 'Stats' },
  ];
  return (
    <header className="hidden sm:flex bg-gray-900 border-b border-gray-800 px-6 py-4 items-center justify-between">
      <Link to="/" className="text-white font-bold text-lg tracking-tight">
        FlashLearn
      </Link>
      <nav className="flex gap-6">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`text-sm ${
              pathname === to ? 'text-blue-400 underline underline-offset-4' : 'text-gray-400 hover:text-white'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
