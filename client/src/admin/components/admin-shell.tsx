import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { AccountActions } from "@/admin/components/account-actions";
import { AdminMobileMenu } from "@/admin/components/admin-mobile-menu";
import { SidebarNav } from "@/admin/components/sidebar-nav";
import { Toaster } from "@/admin/components/toaster";
import { ADMIN_NAV } from "@/admin/nav-items";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Wordmark } from "@/components/ui/wordmark";

/**
 * Layout for every signed-in admin page: sidebar from lg up, a top bar with a
 * full-screen menu below it, a skip link, focus moved to the page content on
 * navigation, and the toast region.
 */
export function AdminShell() {
  const { pathname } = useLocation();
  const menuId = useId();
  const mainRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousPath = useRef(pathname);

  // The menu is "open for this path": changing page closes it with no effect needed.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;

  const closeMenu = useCallback((returnFocus: boolean) => {
    setMenuPath(null);
    if (returnFocus) menuButtonRef.current?.focus();
  }, []);

  // Growing past the mobile layout while the menu is open would leave it locked.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (query.matches) setMenuPath(null);
    };
    query.addEventListener("change", onChange);
    return () => {
      query.removeEventListener("change", onChange);
    };
  }, []);

  // Single-page navigation does not move focus; send it to the content so
  // keyboard and screen-reader users start at the new page.
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  const section = ADMIN_NAV.find((item) => pathname.startsWith(item.to));

  const skipToContent = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    mainRef.current?.focus();
  };

  return (
    <div className="min-h-dvh bg-bg lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <a
        href="#admin-main"
        onClick={skipToContent}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-70 focus:rounded-button focus:bg-accent focus:px-4 focus:py-3 focus:text-micro focus:font-bold focus:tracking-label focus:text-accent-fg focus:uppercase"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-dvh flex-col self-start border-r border-border lg:flex">
        <div className="flex h-16 shrink-0 items-center px-6">
          <Wordmark />
        </div>
        <nav
          aria-label="Admin"
          className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
        >
          <SidebarNav />
        </nav>
        <div className="shrink-0 border-t border-border p-6">
          <AccountActions />
        </div>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-bg px-6 md:px-10.5 lg:px-10">
          <div className="lg:hidden">
            <Wordmark />
          </div>
          <p className="hidden text-label font-medium tracking-label text-fg-subtle uppercase lg:block">
            Admin{" "}
            <span aria-hidden className="mx-1">
              /
            </span>{" "}
            {section?.label ?? "Dashboard"}
          </p>
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => {
                setMenuPath(pathname);
              }}
              className="grid size-11 place-items-center rounded-full bg-surface-raised text-fg transition-colors hover:text-accent-text lg:hidden"
            >
              <Menu aria-hidden size={20} />
            </button>
          </div>
        </header>

        <main
          id="admin-main"
          ref={mainRef}
          tabIndex={-1}
          className="w-full flex-1 px-6 py-8 outline-none md:px-10.5 lg:px-10 lg:py-12"
        >
          <div className="w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>

      <AdminMobileMenu
        id={menuId}
        open={menuOpen}
        onClose={closeMenu}
        closeButtonRef={closeButtonRef}
      />
      <Toaster />
    </div>
  );
}
