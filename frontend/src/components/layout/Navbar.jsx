import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          to="/"
          className="text-xl font-bold text-[var(--primary)] dark:text-[var(--accent)]"
        >
          SmartSpace
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5">
          <Link
            to="/"
            className="hidden text-sm font-medium hover:text-[var(--secondary)] sm:block"
          >
            Home
          </Link>

          <Link
            to="/spaces"
            className="text-sm font-medium hover:text-[var(--secondary)]"
          >
            Spaces
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === "owner" ? "/owner" : "/dashboard"}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="hidden text-sm font-medium text-[var(--secondary)] hover:underline sm:block"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-[var(--secondary)]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
