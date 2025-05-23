export default function StatsSection() {
  return (
    <section className="py-12 md:py-20 lg:pb-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="grid *:text-center items-center grid-cols-3 md:gap-2 divide-x">
          <div className="space-y-4">
            <div className="text-3xl md:text-5xl font-semibold bg-linear-to-r from-zinc-950 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-800">
              +1200
            </div>
            <p>Clients</p>
          </div>
          <div className="space-y-4">
            <div className="text-3xl md:text-5xl font-semibold bg-linear-to-r from-zinc-950 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-800">
              +22
            </div>
            <p>Projects</p>
          </div>
          <div className="space-y-4">
            <div className="text-3xl md:text-5xl font-semibold bg-linear-to-r from-zinc-950 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-800">
              +500
            </div>
            <p>Teams</p>
          </div>
        </div>
      </div>
    </section>
  );
}
