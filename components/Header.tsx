import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/standings', label: 'Standings' },
  { href: '/matchups', label: 'Matchups' },
  { href: '/power-rankings', label: 'Power Rankings' }
];

export function Header({ siteName }: { siteName: string }) {
  return (
    <header className="border-b border-slate-800 bg-gradient-to-r from-turf to-field">
      <div className="container-shell flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Fantasy Football League</p>
          <h1 className="text-xl font-bold text-white md:text-2xl">{siteName}</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md border border-slate-300/20 bg-black/20 px-3 py-1.5 text-sm font-medium text-slate-100 transition hover:border-slate-100/50 hover:bg-black/30"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
