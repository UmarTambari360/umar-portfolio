import { ExternalLink, LogOut } from "lucide-react";
import { useSignOut } from "@/admin/hooks/use-signout";
import { useAuthStore } from "@/admin/stores/auth";
import { Button } from "@/components/ui/button";

/** Who is signed in, a link to the public site, and sign out. Lives in the sidebar footer (desktop and mobile sheet). */
export function AccountActions() {
  const username = useAuthStore((state) => state.username);
  const { signOut, pending } = useSignOut();

  return (
    <div>
      <p className="text-micro tracking-label text-muted-foreground uppercase">
        Signed in as
      </p>
      <p className="mt-1 truncate text-caption text-foreground">{username}</p>
      <div className="mt-4 flex flex-col items-start gap-3">
        <Button asChild variant="ghost" size="inline">
          <a href="/" target="_blank" rel="noopener noreferrer">
            View site
            <ExternalLink aria-hidden size={12} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          loading={pending}
          icon={<LogOut aria-hidden size={14} />}
          onClick={() => {
            void signOut();
          }}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
