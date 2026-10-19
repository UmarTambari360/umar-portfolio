interface CoverArtProps {
  name: string;
  statusText: string;
}

export function EditorialArt({ name, statusText }: CoverArtProps) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex flex-col px-7.25 pt-8.5 pb-9"
    >
      <p className="truncate font-display text-[1.375rem] leading-none font-bold text-art-fg uppercase">
        {name}
      </p>
      <p className="mt-2 text-micro font-bold tracking-label text-accent uppercase">
        {statusText}
      </p>
      <div className="mt-auto grid h-29 grid-cols-[1fr_1.08fr] gap-4">
        <div className="rounded-button bg-art-ink p-4">
          <span className="block h-2 w-3/5 rounded-full bg-art-bar/80" />
          <span className="mt-2 block h-2 w-2/5 rounded-full bg-art-bar/40" />
        </div>
        <div className="relative rounded-button bg-art-ink-2">
          <span className="absolute top-4 left-4 h-11.5 w-23 bg-accent" />
        </div>
      </div>
    </div>
  );
}

const BAR_HEIGHTS = [26, 46, 62, 26, 46, 62, 26] as const;

export function DashboardArt({ name }: Pick<CoverArtProps, "name">) {
  return (
    <div aria-hidden className="absolute inset-0 px-6.25 pt-4.5 pb-5">
      <div className="flex h-8.25 items-center rounded-button bg-art-ink px-4">
        <p className="truncate text-micro font-bold tracking-label text-art-fg uppercase">
          {name}
        </p>
      </div>
      <div className="mt-4 grid h-44.5 grid-cols-[114px_1fr] gap-3">
        <div className="rounded-button bg-art-ink p-2">
          <span className="block h-5.5 w-22 rounded-button bg-accent" />
        </div>
        <div className="grid grid-rows-[75px_1fr] gap-3">
          <div className="grid grid-cols-[1fr_1.27fr] gap-3">
            <div className="rounded-button bg-art-ink" />
            <div className="rounded-button bg-art-ink" />
          </div>
          <div className="flex items-end justify-around rounded-button bg-art-ink px-4 pb-3">
            {BAR_HEIGHTS.map((height, index) => (
              <span
                key={index}
                className="w-4.5 bg-accent"
                style={{ height }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
