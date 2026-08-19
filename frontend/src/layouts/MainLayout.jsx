import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">Smart Workspace</h1>

          <nav className="flex gap-4 text-sm">
            <a href="/">Home</a>
            <a href="/spaces">Spaces</a>
            <a href="/login">Login</a>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
