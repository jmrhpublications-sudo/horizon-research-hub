import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Send, Search, User } from "lucide-react";
import { useJMRH } from "@/context/JMRHContext";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BookOpen, label: "Journal", href: "/journal/about" },
  { icon: Send, label: "Submit", href: "/journal/submit" },
  { icon: Search, label: "Archives", href: "/journal/archives" },
  { icon: User, label: "Account", href: "/auth" },
];

const MobileBottomNav = memo(() => {
  const location = useLocation();
  const { currentUser } = useJMRH();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  // Hide on dashboard pages
  if (location.pathname.startsWith("/secure/")) return null;

  const items = navItems.map(item => {
    if (item.label === "Account" && currentUser) {
      return { ...item, href: "/account", label: currentUser.name.split(' ')[0] || "Account" };
    }
    return item;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-lg border-t border-black/[0.06] safe-area-bottom" aria-label="Mobile navigation">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 min-h-[48px] touch-manipulation transition-colors ${
                active ? "text-gold" : "text-oxford/40"
              }`}
            >
              <item.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-[56px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
});

export default MobileBottomNav;
