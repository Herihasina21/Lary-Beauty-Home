export function Footer() {
    return (
      <footer className="relative bg-rose-nude/80 dark:bg-[#1a1215]/90 pt-16 pb-10 mt-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-or to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <svg viewBox="0 0 48 48" className="h-12 w-12 mx-auto mb-4">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#c9a96e" strokeWidth="1" />
            <text x="24" y="29" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="16" fontWeight="600" fill="currentColor" className="text-anthracite dark:fill-rose-pale">LB</text>
          </svg>
          <p className="font-display text-xl tracking-[0.25em] text-anthracite dark:text-rose-pale">
            LARY BEAUTY HOME <span className="text-rose-sombre">♥</span> L'art de la beauté à domicile
          </p>
          <p className="font-display italic text-rose-sombre mt-3 text-lg">
            Prenez soin de vous, vous le méritez ♥
          </p>
          <nav className="flex flex-wrap justify-center gap-6 mt-8 text-sm tracking-widest uppercase text-texte dark:text-rose-pale/70">
            <a href="#hero" className="hover:text-or">Accueil</a>
            <span className="text-or/40">|</span>
            <a href="#prestations" className="hover:text-or">Prestations</a>
            <span className="text-or/40">|</span>
            <a href="#rdv" className="hover:text-or">Réservation</a>
            <span className="text-or/40">|</span>
            <a href="#contact" className="hover:text-or">Contact</a>
          </nav>
          <p className="text-xs text-texte/60 dark:text-rose-pale/40 mt-8">
            © {new Date().getFullYear()} Lary Beauty Home — Tous droits réservés
          </p>
        </div>
      </footer>
    );
  }
  