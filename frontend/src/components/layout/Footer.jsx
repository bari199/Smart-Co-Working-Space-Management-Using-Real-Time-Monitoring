const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center">
        <p className="text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} SmartSpace. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
