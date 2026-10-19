import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/admin/components/button";
import { useSignOut } from "@/admin/hooks/use-signout";
import { useAuthStore } from "@/admin/stores/auth";

/** Who is signed in, a link to the public site, and sign out. Used in the sidebar and the mobile menu. */
export function AccountActions() {
  const username = useAuthStore((state) => state.username);
  const { signOut, pending } = useSignOut();

  return (
    <div>
      <p className="text-micro tracking-label text-fg-subtle uppercase">
        Signed in as
      </p>
      <p className="mt-1 truncate text-caption text-fg">{username}</p>
      <div className="mt-4 flex flex-col items-start gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-micro font-bold tracking-label text-fg uppercase hover:text-accent-text"
        >
          View site
          <ExternalLink aria-hidden size={12} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <Button
          variant="secondary"
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
