import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileUp,
  Briefcase,
  ClipboardCheck,
  BarChart3,
  Map,
  MessageSquareText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  // { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Upload Resume", url: "/upload", icon: FileUp },
  { title: "Select Role", url: "/select-role", icon: Briefcase },
  { title: "Assessment", url: "/assessment", icon: ClipboardCheck },
  { title: "Analysis", url: "/analysis", icon: BarChart3 },
  { title: "Roadmap", url: "/roadmap", icon: Map },
  // { title: "Interview Prep", url: "/interview", icon: MessageSquareText },
];

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[240px] bg-card shadow-card flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-foreground tracking-tight">PRGA</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-smooth"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-14 bg-background/80 backdrop-blur-sm flex items-center px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-3 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
        </header>

        <main className="flex-1 px-4 lg:px-6 pb-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
