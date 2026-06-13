interface Props {
    title: string;
    subtitle?: string;
    eyebrow?: string;
  }
  
  export function SectionTitle({ title, subtitle, eyebrow }: Props) {
    return (
      <div className="text-center mb-12">
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.3em] text-rose-moyen mb-3">{eyebrow}</p>
        )}
        <h2 className="font-display text-4xl md:text-5xl font-light text-anthracite dark:text-rose-pale">{title}</h2>
        <div className="ornament-line my-4 text-or">
          <span className="text-lg">✦</span>
        </div>
        {subtitle && (
          <p className="font-display italic text-lg text-rose-sombre max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>
    );
  }  