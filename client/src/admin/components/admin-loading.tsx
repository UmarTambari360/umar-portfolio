/** Full-screen placeholder while the admin chunk or the session check loads. */
export function AdminLoading() {
  return (
    <div role="status" className="grid min-h-dvh place-items-center bg-bg">
      <p className="text-micro font-bold tracking-label text-fg-subtle uppercase">
        Loading
      </p>
    </div>
  );
}
