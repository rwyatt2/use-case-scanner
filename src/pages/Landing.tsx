import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './Landing.module.css'

/** Step 1: document + chat bubble (add docs / describe) */
function StepIconDocs() {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.stepSvg}>
      <path d="M8 8h24v6H8V8zm0 10h18v2H8v-2zm0 6h22v2H8v-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M36 14h20l-4 4 4 4h-20V14z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
      <circle cx="48" cy="32" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  )
}

/** Step 2: radar / scan waves */
function StepIconScan() {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.stepSvg}>
      <circle cx="32" cy="24" r="4" fill="currentColor" opacity="0.9" />
      <circle cx="32" cy="24" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="32" cy="24" r="18" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M32 8v6M32 34v6M8 24h6M50 24h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

/** Step 3: build / wrench */
function StepIconBuild() {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.stepSvg}>
      <path d="M24 28l-4 4-6-6 4-4 6 6zm16-16l4-4 6 6-4 4-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
      <path d="M38 18l-8 8M26 30l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <circle cx="44" cy="36" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  )
}

export function Landing() {
  const hero = useScrollReveal({ threshold: 0.2 })
  const features = useScrollReveal({ threshold: 0.08 })
  const benefits = useScrollReveal({ threshold: 0.08 })
  const proof = useScrollReveal({ threshold: 0.1 })
  const cta = useScrollReveal({ threshold: 0.1 })

  return (
    <div className={styles.page}>
      {/* Tech-driven background layers */}
      <div className={styles.bg} aria-hidden />
      <div className={styles.bgGrid} aria-hidden />
      <div className={styles.bgDots} aria-hidden />
      <div className={styles.bgGlow} aria-hidden />
      <div className={styles.bgCircuit} aria-hidden />
      <div className={styles.bgOrb} aria-hidden />

      <header className={styles.header}>
        <Link to={ROUTES.LANDING} className={styles.logo}>
          <span className={styles.logoIcon}>◇</span>
          Use Case Scanner
        </Link>
        <nav className={styles.nav}>
          <Link to={ROUTES.LOGIN} className={styles.navLink}>
            Sign in
          </Link>
          <Link to={ROUTES.LOGIN} className={styles.ctaNav}>
            Get started
          </Link>
        </nav>
      </header>

      <main>
        <section
          ref={hero.ref}
          className={`${styles.hero} ${hero.visible ? styles.visible : ''}`}
          aria-labelledby="hero-headline"
        >
          <p className={styles.heroBadge}>Enterprise AI discovery</p>
          <div className={styles.heroHeadlineWrap}>
            <h1 id="hero-headline" className={styles.heroHeadline}>
              Stop guessing what you have.
              <br />
              <span className={styles.heroHighlight}>Know it.</span>
            </h1>
            <div className={styles.heroAccentLine} aria-hidden />
          </div>
          <p className={styles.heroSub}>
            Describe an AI use case. We scan your APIs, docs, repos, and data—then show you exactly what already supports it and what to build next. <strong>Ship faster, avoid duplicate work, and keep one source of truth.</strong> No spreadsheets. No risk.
          </p>
          <div className={styles.heroCtas}>
            <Link to={ROUTES.LOGIN} className={styles.ctaPrimary}>
              Get started free
            </Link>
            <Link to={ROUTES.SCAN} className={styles.ctaSecondary}>
              Run a scan →
            </Link>
          </div>
          <p className={styles.heroNote}>Read-only. No writes to your systems. Integrate in minutes.</p>
        </section>

        <section
          ref={features.ref}
          className={`${styles.features} ${styles.sectionAlt} ${features.visible ? styles.visible : ''}`}
          aria-labelledby="features-heading"
        >
          <div className={styles.featuresInner}>
          <span className={styles.sectionLabel} aria-hidden>How it works</span>
          <h2 id="features-heading" className={styles.sectionTitle}>
            Built for how you ship
          </h2>
          <p className={styles.sectionSub}>
            One workflow: discover → decide → build. No more “do we already have something for this?”
          </p>
          <div className={styles.featureGrid}>
            <article className={`${styles.featureCard} ${styles.step1}`} data-step="1">
              <div className={styles.featureBadgeRow}>
                <div className={styles.featureIcon} aria-hidden>1</div>
                <div className={styles.featureIllustration} aria-hidden>
                  <StepIconDocs />
                </div>
              </div>
              <h3 className={styles.featureTitle}>Add docs or describe a use case</h3>
              <p className={styles.featureDesc}>Paste strategy docs, or type the use case. AI suggests what to scan—you choose.</p>
              <div className={styles.featureMockHint}>Like a chat—type or paste, then go.</div>
            </article>
            <article className={`${styles.featureCard} ${styles.step2}`} data-step="2">
              <div className={styles.featureBadgeRow}>
                <div className={styles.featureIcon} aria-hidden>2</div>
                <div className={styles.featureIllustration} aria-hidden>
                  <StepIconScan />
                </div>
              </div>
              <h3 className={styles.featureTitle}>Scan your infrastructure</h3>
              <p className={styles.featureDesc}>We read your APIs, services, docs, and data catalogs. You get a clear map of what exists vs. gaps.</p>
              <div className={styles.featureMockHint}>Read-only—we never write to your systems.</div>
            </article>
            <article className={`${styles.featureCard} ${styles.step3}`} data-step="3">
              <div className={styles.featureBadgeRow}>
                <div className={styles.featureIcon} aria-hidden>3</div>
                <div className={styles.featureIllustration} aria-hidden>
                  <StepIconBuild />
                </div>
              </div>
              <h3 className={styles.featureTitle}>Build only what’s missing</h3>
              <p className={styles.featureDesc}>Export specs or create tickets. No duplicate work. No surprises.</p>
              <div className={styles.featureMockHint}>Export spec or create a ticket in one click.</div>
            </article>
          </div>
          </div>
        </section>

        <section
          ref={benefits.ref}
          className={`${styles.benefits} ${benefits.visible ? styles.visible : ''}`}
          aria-labelledby="benefits-heading"
        >
          <div className={styles.benefitsInner}>
          <span className={styles.sectionLabel} aria-hidden>Why teams choose us</span>
          <h2 id="benefits-heading" className={styles.benefitsTitle}>
            Real value, from day one
          </h2>
          <p className={styles.benefitsSub}>
            Teams use Use Case Scanner to cut waste, speed delivery, and stay audit-ready—without changing how they work.
          </p>
          <div className={styles.benefitsGrid}>
            <article className={styles.benefitCard}>
              <h3 className={styles.benefitTitle}>Ship faster</h3>
              <p className={styles.benefitDesc}>
                Go from “do we have something for this?” to a clear map in minutes. No manual catalog trawling or cross-team ping-pong.
              </p>
            </article>
            <article className={styles.benefitCard}>
              <h3 className={styles.benefitTitle}>Avoid duplicate work</h3>
              <p className={styles.benefitDesc}>
                See what already exists before you build. Reuse APIs, models, and data instead of spinning up duplicate capabilities.
              </p>
            </article>
            <article className={styles.benefitCard}>
              <h3 className={styles.benefitTitle}>One source of truth</h3>
              <p className={styles.benefitDesc}>
                Use cases, scans, and gaps live in one place. Share links with stakeholders and keep alignment without extra docs.
              </p>
            </article>
            <article className={styles.benefitCard}>
              <h3 className={styles.benefitTitle}>Audit-ready</h3>
              <p className={styles.benefitDesc}>
                Read-only scanning and exportable specs. Prove what you have, what you’re building, and how it ties to use cases—for compliance and governance.
              </p>
            </article>
          </div>
          </div>
        </section>

        <section
          ref={proof.ref}
          className={`${styles.proof} ${styles.sectionAlt} ${proof.visible ? styles.visible : ''}`}
          aria-labelledby="proof-heading"
        >
          <h2 id="proof-heading" className={styles.visuallyHidden}>
            Trust and integration
          </h2>
          <div className={styles.proofInner}>
          <div className={styles.proofStrip}>
            <span className={styles.proofLabel}>Why it’s safe</span>
            <div className={styles.proofItems}>
              <span className={styles.proofItem}>Read-only scan</span>
              <span className={styles.proofItem}>Your auth & catalog</span>
              <span className={styles.proofItem}>No lock-in</span>
              <span className={styles.proofItem}>Export & audit trail</span>
            </div>
          </div>
          </div>
        </section>

        <section
          ref={cta.ref}
          className={`${styles.finalCta} ${cta.visible ? styles.visible : ''}`}
          aria-labelledby="cta-heading"
        >
          <h2 id="cta-heading" className={styles.ctaHeadline}>
            Ready to ship faster and avoid duplicate work?
          </h2>
          <p className={styles.ctaSub}>See what you have in minutes. No credit card. Read-only—we never write to your systems.</p>
          <Link to={ROUTES.LOGIN} className={styles.ctaButton}>
            Sign in / Get started
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link to={ROUTES.LANDING} className={styles.footerLogo}>
            <span className={styles.logoIcon}>◇</span> Use Case Scanner
          </Link>
          <p className={styles.footerCopy}>Ship faster · Avoid duplicate work · One source of truth · Read-only · No lock-in</p>
        </div>
      </footer>
    </div>
  )
}
