import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

const navItems = [
  { path: "/", icon: "Coins", label: "Кликер" },
  { path: "/profile", icon: "User", label: "Профиль" },
  { path: "/withdraw", icon: "CreditCard", label: "Вывод" },
  { path: "/history", icon: "ClipboardList", label: "История" },
  { path: "/settings", icon: "Settings", label: "Настройки" },
  { path: "/support", icon: "HeadphonesIcon", label: "Поддержка" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 w-full" style={{
        background: "linear-gradient(90deg, hsl(220,40%,10%) 0%, hsl(220,35%,12%) 100%)",
        borderBottom: "1px solid rgba(251,191,36,0.2)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.4)"
      }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-montserrat font-800 tracking-widest uppercase gold-text">
            ДОБРО ПОЖАЛОВАТЬ
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-amber-400 bg-amber-400/10 border border-amber-400/30"
                      : "text-slate-300 hover:text-amber-300 hover:bg-white/5"
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile burger */}
          <button
            className="md:hidden text-amber-400 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-1 animate-fade-in"
            style={{ background: "hsl(220,40%,10%)" }}>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "text-amber-400 bg-amber-400/10 border border-amber-400/20"
                      : "text-slate-300 hover:text-amber-300"
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* BOTTOM NAV (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-2 px-2"
        style={{
          background: "linear-gradient(0deg, hsl(220,40%,8%) 0%, hsl(220,38%,10%) 100%)",
          borderTop: "1px solid rgba(251,191,36,0.15)"
        }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-all ${
                active ? "text-amber-400" : "text-slate-500"
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
