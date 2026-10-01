type Props = { title: string; lead: string };

/**
 * Opening of every inner page: the one h1, in the B5 heading gradient (as on the hero),
 * plus a lead. Clears the floating nav pill.
 */
export function PageHeader({ title, lead }: Props) {
  return (
    <header className="px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pb-16">
      <div className="mx-auto mt-12 max-w-7xl lg:mt-16">
        <h1 className="text-hero-gradient w-fit max-w-measure pb-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-measure text-lg text-aegean-soft lg:text-xl">{lead}</p>
      </div>
    </header>
  );
}
