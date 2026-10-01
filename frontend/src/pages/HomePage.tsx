import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Search,
  Plus,
  Check,
  FileText,
  ShieldCheck,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  FileCheck,
  Clock,
  Layers,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { Section } from '../components/common/Section';
import { SectionHeading } from '../components/common/SectionHeading';
import { CASBadge } from '../components/common/CASBadge';
import { SpecRow } from '../components/common/SpecRow';
import { ProductCard } from '../components/common/ProductCard';
import { api } from '../api/client';
import { VERIFIED_PRODUCTS } from '../api/verifiedProducts';
import { useRFQ } from '../context/RFQContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, isInBasket } = useRFQ();

  // Hero interactive search state
  const [heroSearch, setHeroSearch] = useState('');
  const [heroCategoryFilter, setHeroCategoryFilter] = useState<string>('all');

  // Explorer tab state
  const [explorerTab, setExplorerTab] = useState<string>('api');

  // Fetch settings & industries
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  const { data: industries = [] } = useQuery({
    queryKey: ['industries'],
    queryFn: () => api.getIndustries(),
  });

  // Hero filter products
  const heroFilteredProducts = useMemo(() => {
    let list = [...VERIFIED_PRODUCTS];
    if (heroCategoryFilter !== 'all') {
      list = list.filter((p) => p.category?.slug === heroCategoryFilter);
    }
    if (heroSearch.trim()) {
      const q = heroSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.chemical_name.toLowerCase().includes(q) ||
          (p.cas_number && p.cas_number.includes(q)) ||
          (p.therapeutic_category && p.therapeutic_category.toLowerCase().includes(q))
      );
    }
    return list.slice(0, 5);
  }, [heroSearch, heroCategoryFilter]);

  // Explorer tab products
  const explorerProducts = useMemo(() => {
    return VERIFIED_PRODUCTS.filter((p) => p.category?.slug === explorerTab).slice(0, 6);
  }, [explorerTab]);

  const phone = settings?.company?.phone || '+91 97274 04415';

  // 6 Core Pillars data
  const pillars = [
    {
      num: '01',
      title: 'Active Pharmaceutical Ingredients (APIs)',
      count: '94 Listed Monographs',
      spec: 'IP · BP · USP · EP · JP Grades',
      desc: 'Supplying bulk active substances for formulation plants. High-volume coverage across Analgesics, Antibiotics, NSAIDs, Antivirals, and Cardiovascular compounds with batch-specific CoAs.',
      link: '/products?category=api',
    },
    {
      num: '02',
      title: 'Industrial Solvents & Intermediates',
      count: '20 Core Chemical Lines',
      spec: 'ISO Tank, Drum & Road Tanker Dispatch',
      desc: 'Bulk and packaged distribution of MEG, DMF, Toluene, Acetone, N-Hexene, Ethyl Acetate, and Isopropyl Alcohol (IPA) with strict purity assay compliance.',
      link: '/products?category=solvents',
    },
    {
      num: '03',
      title: 'In-House Phosphate Manufacturing',
      count: '11 Salt Specifications',
      spec: 'Crystals & Anhydrous Powders',
      desc: 'Dedicated domestic synthesis of Mono, Di, Tri, and Tetra Sodium, Potassium, and Ammonium Phosphates (MSP, DSP, TSP, TSPP, MKP, TKP, MAP, DAP, SAPP) for technical and food applications.',
      link: '/products?category=manufacturing-phosphates',
    },
    {
      num: '04',
      title: 'Direct Global Import Lines',
      count: '05 Exclusive Sourcing Lines',
      spec: 'Direct Container Sourcing (China Make)',
      desc: 'Direct import distribution of EDTA Di-Sodium & Tetra-Sodium, Sodium Percarbonate (Coated Granules), Citric Acid (Anhydrous/Monohydrate), Sodium Gluconate, and Xanthan Gum.',
      link: '/products?category=imports',
    },
    {
      num: '05',
      title: 'Technical & Commercial Acids',
      count: '06 Industrial Acids',
      spec: 'GNFC Glacial 99.8% & Technical Grades',
      desc: 'Authorized distribution of Glacial Acetic Acid 99.8% (GNFC), Formic Acid 85%, Hydrochloric Acid, Sulphuric Acid 98%, Phosphoric Acid 85%, and Sulphamic Acid.',
      link: '/products?category=acids',
    },
    {
      num: '06',
      title: 'NDT & Quality Assurance Services',
      count: '06 Testing Methodologies',
      spec: 'ASME · API 510/570 · ASTM Standards',
      desc: 'Engineering inspection division providing Non-Destructive Testing (UT, RT, MPT, DPT), Risk-Based Inspection (RBI), welding qualification (WPS/PQR), and third-party vendor audits.',
      link: '/services',
    },
  ];

  // Verified Principals
  const principals = [
    {
      name: 'Grasim Industries Ltd.',
      group: 'Aditya Birla Group',
      products: 'Bleaching Powder (Vikram), Aluminium Chloride, Sodium Sulphate, Caustic Soda Flakes & Lye',
    },
    {
      name: 'Gujarat Alkalies and Chemicals Limited (GACL)',
      group: 'Govt. of Gujarat Undertaking',
      products: 'Sodium Bicarbonate, Soda Ash, Di-Calcium Phosphate, Benzalkonium Chloride (BKC 50% & 80%)',
    },
    {
      name: 'GNFC',
      group: 'Gujarat Narmada Valley Fertilizers & Chemicals',
      products: 'Formic Acid 85%, Glacial Acetic Acid 99.8%',
    },
    {
      name: 'Magnesia Chemical LLP',
      group: 'Specialty Minerals',
      products: 'High Purity Magnesium Compounds, Magnesium Carbonate, Magnesium Sulphate Crystals',
    },
  ];

  return (
    <div className="home-editorial">
      {/* ======================================================================
          1. HERO SECTION: Typographic Headline + Spec-Style Product Finder Console
          ====================================================================== */}
      <section
        style={{
          borderBottom: '1px solid var(--color-rule)',
          backgroundColor: 'var(--color-paper)',
          padding: 'clamp(48px, 6vw, 88px) 0 clamp(40px, 5vw, 72px) 0',
        }}
      >
        <Container>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(32px, 4vw, 56px)',
            alignItems: 'start',
          }}>
            {/* Left Column: Authoritative Editorial Statement */}
            <div style={{ gridColumn: 'span 12' }} className="hero-left-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="section-index">01 / COMMERCIAL SOURCING</span>
                <span style={{ color: 'var(--color-rule-strong)' }}>/</span>
                <span className="eyebrow" style={{ marginBottom: 0 }}>
                  AURA SPACE INFRA PRIVATE LIMITED
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'var(--font-size-hero)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-ink-navy)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Active Pharmaceutical Ingredients, Industrial Solvents & Specialty Chemicals.
              </h1>

              <p
                className="body-large"
                style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-8)',
                  maxWidth: '56ch',
                }}
              >
                Sourcing and supplying 94 Active Pharmaceutical Ingredients (IP/BP/USP/EP/JP), high-purity industrial solvents, and in-house manufactured phosphates directly to commercial formulation and manufacturing facilities across India since 2014.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/get-a-quote" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
                  <span>Request Commercial Quotation</span>
                  <ArrowRight size={18} />
                </Link>

                <Link to="/products" className="btn btn-secondary btn-lg">
                  <span>Browse 140+ Product Directory</span>
                </Link>
              </div>

              {/* Sourcing Framework Proof Strip */}
              <div style={{
                marginTop: 'var(--space-8)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--color-rule)',
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-family-mono)',
                color: 'var(--color-text-muted)',
              }}>
                <div>ESTD. 2014 (ROC AHMEDABAD)</div>
                <div>·</div>
                <div>94 MONOGRAPH APIS</div>
                <div>·</div>
                <div>19 INDUSTRIAL SECTORS</div>
              </div>
            </div>

            {/* Right Column: Functional Spec-Style Product Finder Console */}
            <div style={{ gridColumn: 'span 12' }} className="hero-right-col">
              <div style={{
                backgroundColor: 'var(--color-surface-white)',
                border: '1px solid var(--color-rule-strong)',
                borderRadius: 'var(--radius-xs)',
                boxShadow: 'var(--shadow-dropdown)',
                overflow: 'hidden',
              }}>
                {/* Console Header */}
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: 'var(--color-ink-navy)',
                  color: 'var(--color-text-on-dark)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Search size={16} color="var(--color-teal-border)" />
                    <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Specification Product Finder
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.6875rem', color: 'var(--color-teal-border)' }}>
                    REAL-TIME ALLOCATION
                  </span>
                </div>

                {/* Search Input */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-rule)' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      placeholder="Type chemical name or CAS # (e.g. Paracetamol, 103-90-2)..."
                      className="form-input"
                      style={{ paddingLeft: '38px', fontSize: '0.875rem' }}
                    />
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  </div>

                  {/* Category Filter Pills */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'all', label: 'All Chemicals' },
                      { id: 'api', label: 'APIs (94)' },
                      { id: 'solvents', label: 'Solvents (20)' },
                      { id: 'manufacturing-phosphates', label: 'Phosphates (11)' },
                      { id: 'imports', label: 'Imports (5)' },
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setHeroCategoryFilter(pill.id)}
                        style={{
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--font-family-mono)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-xs)',
                          border: heroCategoryFilter === pill.id ? '1px solid var(--color-teal)' : '1px solid var(--color-rule)',
                          backgroundColor: heroCategoryFilter === pill.id ? 'var(--color-teal-subtle)' : 'var(--color-paper)',
                          color: heroCategoryFilter === pill.id ? 'var(--color-teal)' : 'var(--color-text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Matched Specifications List */}
                <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {heroFilteredProducts.length === 0 ? (
                    <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                      No chemical found matching &ldquo;{heroSearch}&rdquo;.
                      <div style={{ marginTop: '8px' }}>
                        <Link to={`/get-a-quote?product=${encodeURIComponent(heroSearch)}`} style={{ color: 'var(--color-teal)', fontWeight: 500 }}>
                          Submit custom inquiry for this compound →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    heroFilteredProducts.map((p) => {
                      const inBasket = isInBasket(p.slug);
                      return (
                        <div
                          key={p.slug}
                          style={{
                            padding: '12px 20px',
                            borderBottom: '1px solid var(--color-rule)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                          }}
                        >
                          <div>
                            <Link
                              to={`/products/detail/${p.slug}`}
                              style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-ink-navy)', display: 'block', marginBottom: '2px' }}
                            >
                              {p.chemical_name}
                            </Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {p.cas_number && <CASBadge cas={p.cas_number} />}
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                {p.grade || p.therapeutic_category || p.category?.name}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => addItem({
                                slug: p.slug,
                                chemical_name: p.chemical_name,
                                cas_number: p.cas_number || undefined,
                                category: p.category?.name,
                                grade: p.grade || undefined,
                              })}
                              className={inBasket ? 'btn btn-secondary btn-sm' : 'btn btn-teal btn-sm'}
                              style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}
                              aria-label={inBasket ? `${p.chemical_name} in RFQ basket` : `Add ${p.chemical_name} to RFQ basket`}
                            >
                              {inBasket ? <><Check size={12} /> In RFQ</> : <><Plus size={12} /> Add</>}
                            </button>
                            <Link
                              to={`/products/detail/${p.slug}`}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '4px 8px' }}
                              title="View Datasheet"
                            >
                              <FileText size={14} />
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Console Footer */}
                <div style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--color-paper-subtle)',
                  borderTop: '1px solid var(--color-rule)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-family-mono)',
                  color: 'var(--color-text-muted)',
                }}>
                  <span>Press ⌘K for full catalog search</span>
                  <Link to="/products" style={{ color: 'var(--color-teal)', fontWeight: 600 }}>
                    Full Directory (140+) →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ======================================================================
          2. TRUST STRIP: Verified Operational Figures & Pharmacopeia Marks
          ====================================================================== */}
      <section
        style={{
          borderBottom: '1px solid var(--color-rule)',
          backgroundColor: 'var(--color-surface-white)',
          padding: '24px 0',
        }}
      >
        <Container>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}>
            <div style={{ borderLeft: '3px solid var(--color-teal)', paddingLeft: '14px' }}>
              <div style={{ fontFamily: 'var(--font-family-mono)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink-navy)' }} className="tabular-nums">
                ESTD. 2014
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ROC Ahmedabad Registered
              </div>
            </div>

            <div style={{ borderLeft: '3px solid var(--color-teal)', paddingLeft: '14px' }}>
              <div style={{ fontFamily: 'var(--font-family-mono)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink-navy)' }} className="tabular-nums">
                94 APIS LISTED
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pharmacopeial Monographs
              </div>
            </div>

            <div style={{ borderLeft: '3px solid var(--color-teal)', paddingLeft: '14px' }}>
              <div style={{ fontFamily: 'var(--font-family-mono)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink-navy)' }} className="tabular-nums">
                19 INDUSTRIES
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Manufacturing Sectors
              </div>
            </div>

            <div style={{ borderLeft: '3px solid var(--color-teal)', paddingLeft: '14px' }}>
              <div style={{ fontFamily: 'var(--font-family-mono)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-ink-navy)', letterSpacing: '0.06em' }}>
                IP · BP · USP · EP · JP
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Monograph Standards
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ======================================================================
          3. WHAT WE SUPPLY: Six Core Pillars as Indexed Editorial Rows (01-06)
          ====================================================================== */}
      <Section background="paper">
        <Container>
          <SectionHeading
            index="02"
            eyebrow="SUPPLY CAPABILITIES"
            title="Six Strategic Chemical & Service Pillars"
            description="Our distribution model combines domestic API sourcing, high-volume solvent trading, in-house phosphate crystal synthesis, direct overseas imports, and engineering quality assurance."
          />

          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--color-rule-strong)' }}>
            {pillars.map((pillar) => (
              <div
                key={pillar.num}
                style={{
                  padding: '24px 0',
                  borderBottom: '1px solid var(--color-rule)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                  gap: '16px',
                  alignItems: 'baseline',
                  transition: 'background-color var(--motion-duration-fast)',
                }}
                className="pillar-editorial-row"
              >
                {/* Index & Title */}
                <div style={{ gridColumn: 'span 12' }} className="pillar-col-title">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                    <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.875rem', color: 'var(--color-teal)', fontWeight: 600 }}>
                      {pillar.num}
                    </span>
                    <div>
                      <Link to={pillar.link} style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--color-ink-navy)', marginBottom: '4px' }}>
                          {pillar.title}
                        </h3>
                      </Link>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)' }}>
                        <span>{pillar.count}</span>
                        <span>·</span>
                        <span style={{ color: 'var(--color-amber)' }}>{pillar.spec}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div style={{ gridColumn: 'span 12' }} className="pillar-col-desc">
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {pillar.desc}
                  </p>
                </div>

                {/* Action Link */}
                <div style={{ gridColumn: 'span 12', textAlign: 'right' }} className="pillar-col-action">
                  <Link
                    to={pillar.link}
                    className="btn btn-outline btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <span>View Specifications</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ======================================================================
          4. PRODUCT EXPLORER: Real Category Tabs with SpecRows
          ====================================================================== */}
      <Section background="white">
        <Container>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: '16px' }}>
            <SectionHeading
              index="03"
              eyebrow="PRODUCT DIRECTORY PREVIEW"
              title="Verified Chemical Specifications"
              description="Review chemical specifications, CAS identifiers, and pharmacopeial standards across our core supply categories."
              style={{ marginBottom: 0 }}
            />

            <Link to="/products" className="btn btn-secondary" style={{ gap: '6px' }}>
              <span>View Full 140+ Catalog</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: 'var(--space-6)',
            borderBottom: '1px solid var(--color-rule)',
            paddingBottom: '8px',
            overflowX: 'auto',
          }}>
            {[
              { id: 'api', label: 'Active Pharmaceutical Ingredients (94)' },
              { id: 'solvents', label: 'Industrial Solvents (20)' },
              { id: 'manufacturing-phosphates', label: 'Manufactured Phosphates (11)' },
              { id: 'imports', label: 'Direct Imports (5)' },
              { id: 'acids', label: 'Technical Acids (6)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setExplorerTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: '0.8125rem',
                  fontWeight: explorerTab === tab.id ? 600 : 400,
                  backgroundColor: explorerTab === tab.id ? 'var(--color-ink-navy)' : 'transparent',
                  color: explorerTab === tab.id ? '#FFFFFF' : 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {explorerProducts.map((prod) => (
              <ProductCard key={prod.slug} product={prod} />
            ))}
          </div>
        </Container>
      </Section>

      {/* ======================================================================
          5. HOW SOURCING WORKS: Horizontal Process Architecture
          ====================================================================== */}
      <Section background="paper">
        <Container>
          <SectionHeading
            index="04"
            eyebrow="COMMERCIAL WORKFLOW"
            title="How Chemical Procurement Works"
            description="A structured, transparent procurement process designed for pharmaceutical compliance, commercial agility, and reliable plant supply."
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            borderTop: '1px solid var(--color-rule-strong)',
            paddingTop: '32px',
          }}>
            {[
              {
                step: '01',
                title: 'Specification Enquiry',
                desc: 'Submit chemical name, CAS #, pharmacopeial grade (IP/BP/USP), and target batch volume via RFQ portal or WhatsApp.',
              },
              {
                step: '02',
                title: 'Monograph & Allocation Match',
                desc: 'Our technical desk matches your purity requirements against certified domestic production runs or import container stock.',
              },
              {
                step: '03',
                title: 'Commercial Quotation',
                desc: 'You receive formal, binding commercial pricing with payment terms, packaging specifications, and delivery schedule.',
              },
              {
                step: '04',
                title: 'CoA & Compliance Verification',
                desc: 'Complete documentation release: batch-specific Certificate of Analysis, MSDS/SDS, and regulatory compliance sheets for QA signoff.',
              },
              {
                step: '05',
                title: 'Secure Logistics Dispatch',
                desc: 'Safe transport via compliant carriers with hazardous material licensing, temperature control where required, and direct tracking.',
              },
            ].map((st) => (
              <div
                key={st.step}
                style={{
                  border: '1px solid var(--color-rule)',
                  backgroundColor: 'var(--color-surface-white)',
                  padding: '24px 20px',
                  borderRadius: 'var(--radius-xs)',
                  position: 'relative',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--color-teal)',
                  marginBottom: '12px',
                }}>
                  {st.step}
                </div>
                <h3 style={{ fontSize: '1rem', color: 'var(--color-ink-navy)', marginBottom: '8px' }}>
                  {st.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ======================================================================
          6. MANUFACTURING & DIRECT IMPORTS DUAL CAPABILITY FEATURE
          ====================================================================== */}
      <Section background="white">
        <Container>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(24px, 4vw, 48px)',
          }}>
            {/* Left Box: In-House Manufacturing */}
            <div style={{
              gridColumn: 'span 12',
              border: '1px solid var(--color-rule-strong)',
              borderRadius: 'var(--radius-xs)',
              padding: 'clamp(24px, 4vw, 40px)',
              backgroundColor: 'var(--color-paper)',
            }} className="dual-cap-box">
              <span className="section-index">05A / IN-HOUSE PRODUCTION</span>
              <h2 style={{ fontSize: '1.5rem', margin: '8px 0 16px 0', color: 'var(--color-ink-navy)' }}>
                Phosphates & Inorganic Salt Synthesis
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                Aura Space Infra operates dedicated manufacturing for high-purity inorganic phosphate salts in anhydrous powder and crystalline grades for food processing, detergents, water conditioning, and fertilizers.
              </p>

              <div style={{ borderTop: '1px solid var(--color-rule)', paddingTop: '16px' }}>
                <SpecRow label="SODIUM PHOSPHATES" value="Mono (MSP), Di (DSP), Tri (TSP), Tetra (TSPP)" isMono />
                <SpecRow label="POTASSIUM PHOSPHATES" value="Mono (MKP), Tri (TKP)" isMono />
                <SpecRow label="AMMONIUM PHOSPHATES" value="Mono (MAP), Di (DAP)" isMono />
                <SpecRow label="FORMS AVAILABLE" value="Technical Anhydrous & High Purity Crystals" />
              </div>

              <div style={{ marginTop: '20px' }}>
                <Link to="/products?category=manufacturing-phosphates" className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                  <span>Explore Phosphate Specifications</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Box: Direct Global Imports */}
            <div style={{
              gridColumn: 'span 12',
              border: '1px solid var(--color-rule-strong)',
              borderRadius: 'var(--radius-xs)',
              padding: 'clamp(24px, 4vw, 40px)',
              backgroundColor: 'var(--color-paper)',
            }} className="dual-cap-box">
              <span className="section-index">05B / DIRECT GLOBAL SOURCING</span>
              <h2 style={{ fontSize: '1.5rem', margin: '8px 0 16px 0', color: 'var(--color-ink-navy)' }}>
                Direct Import Portfolios (China Make)
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                We maintain direct overseas manufacturer relationships, managing full container customs clearance and warehouse storage for specialized industrial chelating agents, oxygen bleach compounds, and gums.
              </p>

              <div style={{ borderTop: '1px solid var(--color-rule)', paddingTop: '16px' }}>
                <SpecRow label="EDTA SALTS" value="Di-Sodium & Tetra-Sodium (Jack Chem Make)" isMono />
                <SpecRow label="SODIUM PERCARBONATE" value="Coated Granules & Oxygen Bleach Tablets" isMono />
                <SpecRow label="CITRIC ACID" value="Anhydrous & Monohydrate (High Assay)" isMono />
                <SpecRow label="SODIUM GLUCONATE" value="High Purity Chelating Agent" isMono />
                <SpecRow label="XANTHAN GUM" value="Food Grade & Oilfield Rheology Modifier" isMono />
              </div>

              <div style={{ marginTop: '20px' }}>
                <Link to="/products?category=imports" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                  <span>View Direct Import Lines</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ======================================================================
          7. QUALITY ASSURANCE & DOCUMENTATION PACKAGE
          ====================================================================== */}
      <Section background="paper">
        <Container>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(24px, 4vw, 48px)',
            alignItems: 'center',
          }}>
            <div style={{ gridColumn: 'span 12' }} className="qa-left-col">
              <SectionHeading
                index="06"
                eyebrow="BATCH INTEGRITY & AUDIT TRAIL"
                title="Documentation You Receive with Every Dispatch"
                description="In pharmaceutical and regulated chemical manufacturing, incomplete documentation halts production. Every consignment dispatched by Aura Chemicals carries verifiable compliance certifications."
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {[
                  {
                    title: 'Batch Certificate of Analysis (CoA)',
                    desc: 'Verified chemical assay, melting point, impurity profile, residual solvents, and monograph conformity (IP/BP/USP).',
                  },
                  {
                    title: 'Material Safety Data Sheet (MSDS/SDS)',
                    desc: 'GHS-compliant 16-section safety datasheet detailing hazardous classification, handling, PPE, and spill protocols.',
                  },
                  {
                    title: 'Technical Data Sheet (TDS)',
                    desc: 'Physical/chemical constants, typical packaging options, solubility parameters, and optimal storage conditions.',
                  },
                  {
                    title: 'Batch Traceability & Origin Proof',
                    desc: 'Clear lot numbering, manufacturing dates, expiry/retest horizons, and verified domestic or import origin documentation.',
                  },
                ].map((doc) => (
                  <div
                    key={doc.title}
                    style={{
                      border: '1px solid var(--color-rule)',
                      backgroundColor: 'var(--color-surface-white)',
                      padding: '16px',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <FileCheck size={18} color="var(--color-teal)" />
                      <h3 style={{ fontSize: '0.9375rem', color: 'var(--color-ink-navy)', margin: 0, fontWeight: 600 }}>
                        {doc.title}
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {doc.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ======================================================================
          8. INDUSTRIES SERVED INDEX (19 Sectors Ruled List)
          ====================================================================== */}
      <Section background="white">
        <Container>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: '16px' }}>
            <SectionHeading
              index="07"
              eyebrow="SECTOR COVERAGE"
              title="19 Industrial Manufacturing Sectors"
              description="Aura Chemicals distributes tailored chemical formulations, high-purity solvents, and active compounds to specialized production facilities nationwide."
              style={{ marginBottom: 0 }}
            />

            <Link to="/industries" className="btn btn-secondary" style={{ gap: '6px' }}>
              <span>View All 19 Industry Profiles</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Ruled 2-Column Sector Directory */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px',
          }}>
            {industries.slice(0, 12).map((ind, idx) => (
              <Link
                key={ind.slug}
                to={`/industries#${ind.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'var(--color-paper)',
                  border: '1px solid var(--color-rule)',
                  borderRadius: 'var(--radius-xs)',
                  textDecoration: 'none',
                  transition: 'all var(--motion-duration-fast)',
                }}
                className="industry-index-row"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 600 }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink-navy)' }}>
                    {ind.title.replace(' Industry', '')}
                  </span>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ======================================================================
          9. STRATEGIC SUPPLY PRINCIPALS (Verified Text-First List)
          ====================================================================== */}
      <Section background="paper">
        <Container>
          <SectionHeading
            index="08"
            eyebrow="DISTRIBUTION PARTNERSHIPS"
            title="Strategic Principals & Product Lines We Distribute"
            description="Aura Space Infra acts as an authorized dealer and distributor for leading Indian chemical conglomerates, ensuring authentic manufacturer warranties and consistent supply chain continuity."
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {principals.map((pr) => (
              <div
                key={pr.name}
                style={{
                  border: '1px solid var(--color-rule)',
                  backgroundColor: 'var(--color-surface-white)',
                  padding: '24px 20px',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <span className="eyebrow" style={{ fontSize: '0.625rem', marginBottom: '4px' }}>
                  {pr.group}
                </span>
                <h3 style={{ fontSize: '1.125rem', color: 'var(--color-ink-navy)', marginBottom: '8px' }}>
                  {pr.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  <strong>Product Lines:</strong> {pr.products}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ======================================================================
          10. FINAL COMMERCIAL CTA: Clear Call to Action for Quotation
          ====================================================================== */}
      <section
        style={{
          backgroundColor: 'var(--color-ink-navy)',
          color: 'var(--color-text-on-dark)',
          padding: 'clamp(56px, 7vw, 96px) 0',
          borderTop: '2px solid var(--color-teal)',
        }}
      >
        <Container>
          <div style={{
            maxWidth: '840px',
            margin: '0 auto',
            textAlign: 'center',
          }}>
            <span className="eyebrow" style={{ color: 'var(--color-teal-border)', justifyContent: 'center' }}>
              09 / COMMERCIAL DESK
            </span>

            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                lineHeight: 1.2,
                color: '#FFFFFF',
                marginBottom: 'var(--space-4)',
              }}
            >
              Initiate a Commercial Chemical Quotation.
            </h2>

            <p
              className="body-large"
              style={{
                color: 'var(--color-text-muted-dark)',
                margin: '0 auto var(--space-8) auto',
              }}
            >
              Submit your target volumes, CAS registry numbers, and monograph purity specifications. Our chemical procurement desk provides direct allocation pricing, delivery timelines, and technical CoAs.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/get-a-quote" className="btn btn-teal btn-lg" style={{ gap: '8px' }}>
                <span>Submit Quotation Request (RFQ)</span>
                <ArrowRight size={18} />
              </Link>

              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="btn btn-secondary btn-lg"
                style={{ gap: '8px' }}
              >
                <Phone size={18} color="var(--color-teal)" />
                <span>Call Sales Desk: {phone}</span>
              </a>

              <a
                href="https://wa.me/919727404415"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg"
                style={{
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  gap: '8px',
                }}
              >
                <MessageCircle size={18} color="#25D366" />
                <span>WhatsApp Sourcing Desk</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Responsive layout styles */}
      <style>{`
        @media (min-width: 1024px) {
          .hero-left-col { grid-column: span 7 !important; }
          .hero-right-col { grid-column: span 5 !important; }
          .dual-cap-box { grid-column: span 6 !important; }
          .pillar-col-title { grid-column: span 5 !important; }
          .pillar-col-desc { grid-column: span 5 !important; }
          .pillar-col-action { grid-column: span 2 !important; }
        }
        @media (max-width: 1023px) {
          .hero-left-col, .hero-right-col, .dual-cap-box { grid-column: span 12 !important; }
          .pillar-col-title, .pillar-col-desc, .pillar-col-action { grid-column: span 12 !important; text-align: left !important; }
        }
      `}</style>
    </div>
  );
};
