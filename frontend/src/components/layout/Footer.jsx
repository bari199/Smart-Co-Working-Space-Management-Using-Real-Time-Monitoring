import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--primary)] text-white">
      <div className="container-width py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex">
              <span className="rounded-md bg-white px-2.5 py-1 text-sm font-black tracking-tight text-[var(--primary)]">
                FLEXO
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">
              Flexible workspaces for modern teams, professionals and businesses
              across India.
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex gap-2">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <FaInstagram size={16} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <FaLinkedinIn size={16} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <FaTwitter size={16} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <FaFacebookF size={16} />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-bold text-white">Platform</h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/spaces"
                className="text-sm text-white/55 transition hover:text-white"
              >
                Find Spaces
              </Link>

              <Link
                to="/#how-it-works"
                className="text-sm text-white/55 transition hover:text-white"
              >
                How It Works
              </Link>

              <Link
                to="/register"
                className="text-sm text-white/55 transition hover:text-white"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="text-sm font-bold text-white">For Owners</h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/register?role=owner"
                className="text-sm text-white/55 transition hover:text-white"
              >
                List Your Space
              </Link>

              <Link
                to="/login"
                className="text-sm text-white/55 transition hover:text-white"
              >
                Owner Login
              </Link>

              <Link
                to="/register?role=owner"
                className="text-sm text-white/55 transition hover:text-white"
              >
                Become a Host
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold text-white">Support</h3>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="mailto:support@flexo.com"
                className="flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
              >
                <Mail size={14} />
                Contact Support
              </a>

              <a
                href="#"
                className="text-sm text-white/55 transition hover:text-white"
              >
                Help Center
              </a>

              <a
                href="#"
                className="text-sm text-white/55 transition hover:text-white"
              >
                FAQs
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-white">Company</h3>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="#"
                className="text-sm text-white/55 transition hover:text-white"
              >
                About Us
              </a>

              <a
                href="#"
                className="text-sm text-white/55 transition hover:text-white"
              >
                Privacy
              </a>

              <a
                href="#"
                className="text-sm text-white/55 transition hover:text-white"
              >
                Terms
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
          <p>© 2026 Flexo. All rights reserved.</p>

          <p>Flexible workspace marketplace</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
