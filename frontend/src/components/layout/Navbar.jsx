import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          to="/"
          className="text-xl font-bold text-[var(--primary)] dark:text-[var(--accent)]"
        >
          SmartSpace
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium hover:text-[var(--secondary)]"
          >
            Home
          </Link>

          <Link
            to="/spaces"
            className="text-sm font-medium hover:text-[var(--secondary)]"
          >
            Workspaces
          </Link>

          <Link
            to="/login"
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
