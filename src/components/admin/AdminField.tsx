export function AdminField({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  textarea,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  hint?: string;
}) {
  const baseClass =
    "w-full rounded-xl border border-or/20 bg-white px-3 py-2.5 text-sm text-texte outline-none focus:border-or focus:ring-2 focus:ring-or/20 dark:bg-[#2a1a1d] dark:text-rose-pale";

  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-texte dark:text-rose-pale">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          rows={3}
          className={baseClass}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          className={baseClass}
        />
      )}
      {hint && <span className="block text-xs text-texte/50 dark:text-rose-pale/40">{hint}</span>}
    </label>
  );
}

export function AdminCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-or/15 bg-white p-5 shadow-sm dark:bg-[#2a1a1d]">
      <h2 className="mb-4 font-display text-xl text-anthracite dark:text-rose-pale">{title}</h2>
      {children}
    </section>
  );
}
