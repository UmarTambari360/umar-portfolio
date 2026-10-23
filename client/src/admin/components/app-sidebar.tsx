import { NavLink, useLocation } from "react-router-dom";
import { AccountActions } from "@/admin/components/account-actions";
import { ADMIN_NAV } from "@/admin/nav-items";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Wordmark } from "@/components/ui/wordmark";

/** Brand look for menu rows: uppercase micro caps with a lime bar on the active page. */
const MENU_BUTTON_CLASS =
  "relative h-11 gap-3 px-3 text-label font-bold tracking-label uppercase data-[active=true]:font-bold data-[active=true]:before:absolute data-[active=true]:before:inset-y-2 data-[active=true]:before:left-0 data-[active=true]:before:w-0.75 data-[active=true]:before:rounded-full data-[active=true]:before:bg-primary";

/**
 * shadcn Sidebar: a fixed column from `md` up and, below that, a slide-over
 * sheet (opened by the SidebarTrigger in the header) with focus trap and
 * Escape handling built in.
 */
export function AppSidebar() {
  const { pathname } = useLocation();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="h-16 justify-center border-b px-6">
        <Wordmark />
      </SidebarHeader>

      <SidebarContent>
        <nav aria-label="Admin">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {ADMIN_NAV.map(({ to, label, icon: Icon }) => (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(to)}
                      className={MENU_BUTTON_CLASS}
                    >
                      <NavLink
                        to={to}
                        onClick={() => {
                          setOpenMobile(false);
                        }}
                      >
                        <Icon aria-hidden />
                        <span>{label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      </SidebarContent>

      <SidebarFooter className="gap-5 border-t p-6">
        {/* The header shows the theme toggle from md up; the mobile sheet needs its own. */}
        <div className="flex items-center justify-between md:hidden">
          <span className="text-micro tracking-label text-muted-foreground uppercase">
            Theme
          </span>
          <ThemeToggle />
        </div>
        <AccountActions />
      </SidebarFooter>
    </Sidebar>
  );
}
