export interface ImageDto {
  url: string;
  width?: number;
  height?: number;
  alt: string;
  srcset?: string;
}

export interface SeoDto {
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
}

export interface CompanySettingsDto {
  brand_name?: string;
  legal_name?: string;
  group_name?: string;
  tagline?: string;
  roc_registration?: string;
  experience_years?: string;
  supplier_count?: number;
  customer_count_text?: string;
  phone?: string;
  email?: string;
  address?: string | null;
  business_hours?: string | null;
  social_links?: Array<{ platform: string; url: string }>;
}

export interface AnnouncementDto {
  enabled: boolean;
  text: string;
  url?: string;
}

export interface MetricStatDto {
  value: string;
  label: string;
}

export interface SettingsDto {
  company: CompanySettingsDto;
  branding: {
    header_logo?: ImageDto;
    footer_logo?: ImageDto;
  };
  announcement?: AnnouncementDto;
  footer: {
    copyright_text?: string;
    powered_by?: string;
  };
}

export interface StrategicPillarDto {
  id: string;
  title: string;
  description: string;
}

export interface ClientBadgeDto {
  id: number | string;
  name: string;
  logo_url: string;
}

export interface HomeDto {
  hero: {
    eyebrow?: string;
    title?: string;
    tagline?: string;
    cta_primary?: { label: string; url: string };
    cta_secondary?: { label: string; url: string };
    image?: ImageDto;
    capability_strip_enabled?: boolean;
  };
  intro: {
    heading?: string;
    body?: string;
  };
  services: {
    heading?: string;
    body?: string;
  };
  pillars: StrategicPillarDto[];
  stats?: MetricStatDto[];
  clientele: {
    heading?: string;
    subheading?: string;
    clients: ClientBadgeDto[];
  };
  cta: {
    heading?: string;
    body?: string;
    button?: { label: string; url: string };
  };
  announcement?: AnnouncementDto;
  seo?: SeoDto;
}

export interface ProductCategoryDto {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface ProductDto {
  id: number;
  slug: string;
  chemical_name: string;
  cas_number?: string | null;
  category: {
    name: string;
    slug: string;
  };
  therapeutic_category?: string | null;
  molecular_formula?: string | null;
  molecular_weight?: string | null;
  grade?: string | null;
  purity?: string | null;
  packaging?: string | null;
  applications?: string | null;
  datasheet_url?: string | null;
  short_description?: string | null;
  image?: ImageDto | null;
  gallery?: ImageDto[];
  related_industries?: Array<{ slug: string; title: string }>;
  seo?: SeoDto;
}

export interface ProductsResponseDto {
  total: number;
  total_pages: number;
  current_page: number;
  per_page: number;
  products: ProductDto[];
}

export interface IndustryDto {
  id: number;
  slug: string;
  title: string;
  overview: string;
  image?: ImageDto;
}

export interface ServiceDto {
  slug: string;
  title: string;
  description: string;
  capabilities: string[];
  standards?: string;
}

export interface PageDto {
  id: number;
  slug: string;
  title: string;
  content_html: string;
  sections?: Record<string, any>;
  seo?: SeoDto;
}

export interface InquiryPayload {
  name: string;
  company?: string;
  email: string;
  phone: string;
  product?: string;
  cas_number?: string;
  quantity?: string;
  requirement?: string;
  consent: boolean;
  website_url_hp?: string; // Honeypot field
}
