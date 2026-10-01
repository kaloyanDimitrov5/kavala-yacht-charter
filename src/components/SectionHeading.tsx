type Props = { id: string; title: string; lead?: string; className?: string };

/** Section heading pattern: sentence case title, optional lead. No eyebrow labels. */
export function SectionHeading({ id, title, lead, className = "" }: Props) {
  return (
    <div className={`max-w-measure ${className}`}>
      <h2 id={id} className="text-3xl font-semibold tracking-tight text-aegean lg:text-5xl">
        {title}
      </h2>
      {lead && <p className="mt-6 text-lg text-aegean-soft">{lead}</p>}
    </div>
  );
}
