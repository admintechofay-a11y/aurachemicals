import {
  SettingsDto,
  HomeDto,
  ProductCategoryDto,
  ProductDto,
  IndustryDto,
  ServiceDto,
  PageDto,
} from './types';

export const VERIFIED_SETTINGS: SettingsDto = {
  company: {
    brand_name: 'Aura Chemicals',
    legal_name: 'Aura Space Infra Private Limited',
    group_name: 'Aura Group of Companies',
    tagline: 'Your Trusted Partner in Chemical Excellence',
    roc_registration: 'ROC Ahmedabad',
    experience_years: 'Active since 2014',
    supplier_count: 400,
    customer_count_text: 'Verified Indian Manufacturing Allocations',
    phone: '+91 97274 04415',
    email: 'management.aurachemicals@gmail.com',
    address: null,
    business_hours: null,
    social_links: [],
  },
  branding: {
    header_logo: {
      url: '/images/cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png',
      width: 185,
      height: 58,
      alt: 'Aura Chemicals Logo',
    },
    footer_logo: {
      url: '/images/cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png',
      width: 185,
      height: 58,
      alt: 'Aura Chemicals Logo',
    },
  },
  footer: {
    copyright_text: 'Copyright © 2026 Aura Space Infra Pvt. Ltd. All rights reserved.',
    powered_by: 'TECHOFY Global Ventures',
  },
};

export const VERIFIED_HOME: HomeDto = {
  hero: {
    eyebrow: 'Aura Group of Companies',
    title: 'Aura Space Infra Pvt. Ltd.',
    tagline: 'Your Trusted Partner in Chemical Excellence',
    cta_primary: { label: 'Request a Quote', url: '/get-a-quote' },
    cta_secondary: { label: 'Explore Products', url: '/products' },
    image: {
      url: '/images/pexels-pixabay-247763-scaled.jpg',
      width: 2560,
      height: 1707,
      alt: 'Modern chemical and pharmaceutical laboratory facility',
    },
  },
  intro: {
    heading: 'Our Company',
    body: 'The company has earned a strong reputation as a reliable, quality-driven supplier through decades of collective market experience, maintaining close long-term relationships with customers and developing a deep understanding of their specific chemical requirements.',
  },
  services: {
    heading: 'Our Services',
    body: 'Assured quality and reliability in API distribution through 400+ leading suppliers across India, actively serving thousands of customers across diverse industries. Through direct sourcing from domestic manufacturers with proven chemical expertise, we efficiently secure supplies, develop customized compounds, and deliver high-purity products to our clients.',
  },
  pillars: [
    {
      id: 'wide-range',
      title: 'Wide Range of Products',
      description: 'Aura Chemicals offers a diverse portfolio of chemical solutions catering to various industries. Whether you are in manufacturing, agriculture, or healthcare, we have the right products to meet your specific needs.',
    },
    {
      id: 'competitive-pricing',
      title: 'Competitive Pricing',
      description: 'Experience affordability without compromising quality. Aura Chemicals offers competitive pricing, making our products accessible to businesses of all sizes.',
    },
    {
      id: 'reliable-supply-chain',
      title: 'Reliable Supply Chain',
      description: 'Count on a consistent and reliable supply chain when you choose Aura Chemicals. We understand the importance of timely deliveries, ensuring that your operations run smoothly without interruptions.',
    },
    {
      id: 'extensive-network',
      title: 'Extensive Network',
      description: 'With over 7 years of specialized experience in API distribution since 2014, the company is classified as a Non-Government private entity registered with the Registrar of Companies (ROC Ahmedabad).',
    },
  ],
  clientele: {
    heading: 'STRATEGIC SUPPLY PRINCIPALS',
    subheading: 'Authorized Product Lines & Distribution Agencies',
    clients: [
      { id: 1, name: 'Grasim Industries Ltd. (Aditya Birla Group)', logo_url: '' },
      { id: 2, name: 'Gujarat Alkalies and Chemicals Limited (GACL)', logo_url: '' },
      { id: 3, name: 'Gujarat Narmada Valley Fertilizers & Chemicals (GNFC)', logo_url: '' },
      { id: 4, name: 'Magnesia Chemical LLP', logo_url: '' },
    ],
  },
  cta: {
    heading: 'Join Us on the Journey to Excellence',
    body: 'Whether you are a small-scale enterprise or a large industrial manufacturer, Aura Chemicals invites you to partner with us for chemical excellence. Experience the reliability, precision, and customer commitment that have established our reputation in chemical distribution. Beyond trading chemicals, we forge long-term partnerships, empower manufacturing industries, and support sustainable industrial growth.',
    button: { label: 'Explore Products', url: '/products' },
  },
  seo: {
    meta_title: 'Aura Chemicals | Your Trusted Partner in Chemical Excellence',
    meta_description: 'Aura Space Infra Pvt. Ltd. (Aura Chemicals) supplies high-grade APIs, industrial solvents, phosphates, and specialty chemicals across India.',
  },
};

export const VERIFIED_CATEGORIES: ProductCategoryDto[] = [
  { id: 1, name: 'Active Pharmaceutical Ingredients', slug: 'api', count: 94 },
  { id: 2, name: 'Solvents & Base Chemicals', slug: 'solvents', count: 20 },
  { id: 3, name: 'Manufacturing Products (Phosphates)', slug: 'manufacturing-phosphates', count: 11 },
  { id: 4, name: 'Own Import Products (China Make)', slug: 'imports', count: 5 },
  { id: 5, name: 'Technical & Commercial Acids', slug: 'acids', count: 6 },
  { id: 6, name: 'ETP & Industrial Chemicals', slug: 'industrial-chemicals', count: 14 },
  { id: 7, name: 'M/S. Grasim Ind. Ltd.', slug: 'grasim-products', count: 6 },
  { id: 8, name: 'M/S. Magnesia Chemical LLP', slug: 'magnesia-products', count: 4 },
  { id: 9, name: 'GACL Products', slug: 'gacl-products', count: 7 },
];

export const VERIFIED_INDUSTRIES: IndustryDto[] = [
  {
    id: 1,
    slug: 'healthcare',
    title: 'Healthcare & Pharmaceutical Industry',
    overview: 'At Aura Chemicals, we are dedicated to advancing the healthcare and pharmaceutical sector by supplying high-purity APIs, intermediates, and specialty chemicals. Our products comply with stringent regulatory standards, ensuring safety, efficacy, and consistency in pharmaceutical formulations.',
    image: { url: '/images/healthcare.jpeg', width: 612, height: 408, alt: 'Healthcare and Pharmaceuticals' },
  },
  {
    id: 2,
    slug: 'agrochemicals',
    title: 'Agrochemicals & Fertilizers',
    overview: 'We provide high-quality chemicals essential for the formulation of pesticides, herbicides, and fertilizers. Our agrochemical solutions are tailored to enhance crop yield, protect against pests and diseases, and improve soil fertility.',
    image: { url: '/images/agriculture.jpeg', width: 612, height: 408, alt: 'Agrochemicals and Fertilizers' },
  },
  {
    id: 3,
    slug: 'food-beverage',
    title: 'Food and Beverage Industry',
    overview: 'Our portfolio includes food-grade chemicals, additives, preservatives, and acidulants that comply with international food safety standards, helping food manufacturers improve shelf life and maintain texture.',
    image: { url: '/images/food-and-bevearge.jpeg', width: 612, height: 408, alt: 'Food and Beverage Chemical Solutions' },
  },
  {
    id: 4,
    slug: 'cosmetics',
    title: 'Cosmetics and Personal Care',
    overview: 'Aura Chemicals supplies specialized raw materials, including emulsifiers, preservatives, surfactants, and active ingredients, helping formulate safe, high-performing skincare and hygiene products.',
    image: { url: '/images/cosmetic.jpeg', width: 612, height: 408, alt: 'Cosmetics and Personal Care Ingredients' },
  },
  {
    id: 5,
    slug: 'energy-oil-gas',
    title: 'Energy Sector & Oil/Gas',
    overview: 'Essential chemical solutions tailored to the unique demands of the energy sector, from specialty chemicals for oil and gas extraction and refining to products supporting renewable energy technologies.',
    image: { url: '/images/energy-sector.jpeg', width: 612, height: 408, alt: 'Energy and Petrochemical Solutions' },
  },
  {
    id: 6,
    slug: 'water-treatment',
    title: 'Water Treatment & Environmental Management',
    overview: 'Comprehensive range of water treatment chemicals, including coagulants, flocculants, disinfectants, biocides, and scale inhibitors for treating municipal and industrial effluent.',
    image: { url: '/images/water-treatment-plant.jpg', width: 800, height: 533, alt: 'Water Treatment Plant Reagents' },
  },
  {
    id: 7,
    slug: 'automotive',
    title: 'Automotive Industry',
    overview: 'High-performance chemicals used in automotive manufacturing and maintenance, from coatings and adhesives to specialty fluids, coolants, and cleaners.',
    image: { url: '/images/automotive.jpeg', width: 612, height: 408, alt: 'Automotive Chemical Solutions' },
  },
  {
    id: 8,
    slug: 'cleaning-sanitation',
    title: 'Cleaning and Sanitation Industry',
    overview: 'Disinfectants, surfactants, and sanitizing agents designed for industrial, commercial, and household cleaning, supporting optimal hygiene standards.',
    image: { url: '/images/cleaning.jpeg', width: 612, height: 408, alt: 'Cleaning and Sanitation Chemistry' },
  },
  {
    id: 9,
    slug: 'construction',
    title: 'Construction Industry',
    overview: 'Concrete additives, waterproofing agents, sealants, accelerators, and retarders that improve the durability, strength, and workability of construction materials.',
    image: { url: '/images/constuction.jpeg', width: 612, height: 408, alt: 'Construction Additives and Sealants' },
  },
  {
    id: 10,
    slug: 'adhesives-sealants',
    title: 'Adhesives and Sealants Industry',
    overview: 'High-performance resins, polymers, plasticizers, and solvents that improve bonding strength, flexibility, and resistance to environmental stress.',
    image: { url: '/images/adhesives.jpeg', width: 612, height: 408, alt: 'Adhesives and Sealants Resins' },
  },
  {
    id: 11,
    slug: 'leather-tanning',
    title: 'Leather and Tanning Industry',
    overview: 'Chemicals essential for beamhouse, tanning, and finishing processes, producing soft, durable, and weather-resistant leather while supporting eco-friendly practices.',
    image: { url: '/images/leather.jpeg', width: 612, height: 408, alt: 'Leather and Tanning Chemistry' },
  },
  {
    id: 12,
    slug: 'textile',
    title: 'Textile Industry',
    overview: 'Solutions for textile manufacturing processes, from dyeing and printing to finishing, providing eco-friendly chemicals that ensure vibrant colors and soft hand-feel.',
    image: { url: '/images/textind.jpeg', width: 612, height: 408, alt: 'Textile Processing Chemicals' },
  },
  {
    id: 13,
    slug: 'plastics-polymers',
    title: 'Plastics and Polymers Industry',
    overview: 'Plasticizers, stabilizers, additives, and catalysts that improve the flexibility, durability, and strength of plastic products across packaging and industrial components.',
    image: { url: '/images/plastics.jpeg', width: 612, height: 408, alt: 'Plastics and Polymer Additives' },
  },
  {
    id: 14,
    slug: 'mining-metallurgy',
    title: 'Mining and Metallurgy',
    overview: 'Flotation agents, leaching chemicals, corrosion inhibitors, and solvent extraction reagents designed to optimize mineral extraction and ore refining.',
    image: { url: '/images/mining.jpeg', width: 612, height: 408, alt: 'Mining and Metallurgy Reagents' },
  },
  {
    id: 15,
    slug: 'rubber-tyre',
    title: 'Rubber and Tyre Industry',
    overview: 'Vulcanizing agents, accelerators, fillers, antioxidants, and specialty additives that enhance elasticity, tensile strength, and heat resistance.',
    image: { url: '/images/tyre.jpeg', width: 612, height: 408, alt: 'Rubber and Tyre Compounding Chemicals' },
  },
  {
    id: 16,
    slug: 'paints-coatings',
    title: 'Paints and Coatings Industry',
    overview: 'Resins, binders, pigments, solvents, and additives that improve color retention, durability, texture, adhesion, and resistance to environmental weathering.',
    image: { url: '/images/paint.jpeg', width: 612, height: 408, alt: 'Paints and Coatings Formulations' },
  },
  {
    id: 17,
    slug: 'paper-pulp',
    title: 'Paper and Pulp Industry',
    overview: 'Chemicals for pulping, bleaching, sizing, and water treatment that enhance paper strength, brightness, and manufacturing runnability.',
    image: { url: '/images/paper.jpeg', width: 612, height: 408, alt: 'Paper and Pulp Processing Reagents' },
  },
  {
    id: 18,
    slug: 'packaging',
    title: 'Packaging Industry',
    overview: 'Barrier coatings, adhesives, and polymer additives that enhance the strength, shelf life, and sustainability of rigid and flexible packaging materials.',
    image: { url: '/images/packaging.jpeg', width: 612, height: 408, alt: 'Packaging Barrier Coatings and Materials' },
  },
  {
    id: 19,
    slug: 'semiconductors-electronics',
    title: 'Semiconductors and Electronics',
    overview: 'Ultra-high-purity chemical reagents, etchants, and cleaning solvents engineered for semiconductor wafer fabrication and electronic component manufacturing.',
    image: { url: '/images/semiconductor.jpeg', width: 612, height: 408, alt: 'Electronic Grade and Semiconductor Chemicals' },
  },
];

export const VERIFIED_SERVICES: ServiceDto[] = [
  {
    slug: 'chemical-sourcing-distribution',
    title: 'Chemical Sourcing & API Distribution',
    description: 'Assured quality and security in API supplies via 400+ leading domestic manufacturers with chemistry expertise. We efficiently secure supplies, develop customized compounds, and deliver high-purity products to our clients.',
    capabilities: [
      'Direct domestic manufacturer partnerships',
      'Customized chemical synthesis and compound sourcing',
      'Strict pharmacopeial compliance (IP, BP, USP, EP)',
      'Reliable logistics ensuring uninterrupted supply chain continuity',
    ],
  },
  {
    slug: 'quality-assurance-inspection',
    title: 'Comprehensive Inspection & Quality Assurance Services',
    description: 'Engineering testing, quality control, and asset integrity solutions tailored to Oil & Gas, Petrochemicals, Refining, and Manufacturing sectors.',
    capabilities: [
      'Non-Destructive Testing (UT, RT, MPT, DPT, VT, ECT, PAUT, TOFD)',
      'Metallurgical & Corrosion Investigation (Failure Analysis, PMI)',
      'Welding & Fabrication Inspection (WPS/PQR/WPQ qualification)',
      'In-Service Inspection & Risk-Based Inspection (API 510/570/653)',
      'Calibration & Dimensional Inspection',
      'Civil & Infrastructure Non-Destructive Quality Services',
      'Third-Party Vendor Inspection & Expediting',
    ],
    standards: 'ASME, API, ISO, AWS, ASTM, BIS, NABL/ILAC',
  },
];
