import { useEffect, useRef, type MouseEvent } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "@/admin/components/app-sidebar";
import { ADMIN_NAV } from "@/admin/nav-items";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Layout for every signed-in admin page, on shadcn's Sidebar: sidebar from md
 * up and a slide-over sheet below it, a breadcrumb header, a skip link, focus
 * moved to the page content on navigation, and the Sonner toast region.
 */
export function AdminShell() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);

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
    <SidebarProvider>
      <a
        href="#admin-main"
        onClick={skipToContent}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-70 focus:rounded-button focus:bg-accent focus:px-4 focus:py-3 focus:text-micro focus:font-bold focus:tracking-label focus:text-accent-fg focus:uppercase"
      >
        Skip to content
      </a>

      <AppSidebar />

      {/* SidebarInset renders the <main> landmark. */}
      <SidebarInset
        id="admin-main"
        ref={mainRef}
        tabIndex={-1}
        className="min-w-0 outline-none"
      >
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 md:px-6 lg:px-10">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-5"
          />
          <Breadcrumb>
            <BreadcrumbList className="text-label font-medium tracking-label uppercase">
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to="/admin">Admin</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{section?.label ?? "Dashboard"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto hidden md:block">
            <ThemeToggle />
          </div>
        </header>

        <div className="w-full flex-1 px-4 py-8 md:px-6 lg:px-10 lg:py-12">
          <div className="w-full max-w-5xl">
            <Outlet />
          </div>
        </div>
      </SidebarInset>

      <Toaster />
    </SidebarProvider>
  );
}
