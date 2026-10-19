import { NavLink } from "react-router-dom";
import { ADMIN_NAV } from "@/admin/nav-items";
import { cn } from "@/lib/cn";

/** Desktop sidebar links. The active one gets aria-current="page" from NavLink. */
export function SidebarNav() {
  return (
    <ul className="space-y-1">
      {ADMIN_NAV.map(({ to, label, icon: Icon }) => (
        <li key={to}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              cn(
                "relative flex h-11 items-center gap-3 rounded-button px-3 text-label font-bold tracking-label uppercase transition-colors motion-reduce:transition-none",
                isActive
                  ? "bg-surface text-fg before:absolute before:inset-y-2 before:left-0 before:w-0.75 before:rounded-full before:bg-accent"
                  : "text-fg-muted hover:text-fg",
              )
            }
          >
            <Icon aria-hidden size={16} />
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
