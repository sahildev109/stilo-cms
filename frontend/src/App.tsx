import { NavLink, Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4 text-sm">
          <NavLink to="/dashboard" className="hover:text-white">Dashboard</NavLink>
          <NavLink to="/editor" className="hover:text-white">Editor</NavLink>
          <NavLink to="/blog" className="hover:text-white">Blog</NavLink>
          <NavLink to="/login" className="hover:text-white">Login</NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
