export function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-3xl text-anthracite dark:text-rose-pale">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-texte/70 dark:text-rose-pale/60">
          {description}
        </p>
      )}
    </header>
  );
}
