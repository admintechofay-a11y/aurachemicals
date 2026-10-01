import {
  SettingsDto,
  HomeDto,
  ProductCategoryDto,
  ProductDto,
  ProductsResponseDto,
  IndustryDto,
  ServiceDto,
  PageDto,
  InquiryPayload,
} from './types';
import {
  VERIFIED_SETTINGS,
  VERIFIED_HOME,
  VERIFIED_CATEGORIES,
  VERIFIED_INDUSTRIES,
  VERIFIED_SERVICES,
} from './mockData';
import { VERIFIED_PRODUCTS } from './verifiedProducts';

const API_BASE = import.meta.env.VITE_WORDPRESS_API_URL || 'https://aurachemicals.in/wp-json';
const TIMEOUT_MS = 5000;

// Resilience & Mixed-Content Check:
// If running in a public hosted environment (e.g. Vercel, mobile browser) while API_BASE points to
// a local-only domain (.local or localhost), browser Mixed Content (HTTP on HTTPS) and local DNS
// will immediately fail. In that scenario, directly serve the verified corporate dataset.
const isLocalApi = API_BASE.includes('.local') || API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1');

let isApiUnavailable = false;

const shouldBypassLocalApi = (): boolean => {
  if (isApiUnavailable) return true;
  // If API points to a local virtual host (.local) and we are not running on that domain,
  // immediately serve the verified static dataset to prevent browser timeout/mixed-content blocks.
  if (isLocalApi && typeof window !== 'undefined' && !window.location.hostname.endsWith('.local')) {
    return true;
  }
  return false;
};

class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number = 500, code: string = 'internal_error') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function fetchWithTimeout<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(`HTTP Error ${response.status}`, response.status);
    }

    return (await response.json()) as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out after 5000ms', 408, 'timeout');
    }
    throw error;
  }
}

export const api = {
  async getSettings(): Promise<SettingsDto> {
    if (shouldBypassLocalApi()) return VERIFIED_SETTINGS;
    try {
      return await fetchWithTimeout<SettingsDto>(`${API_BASE}/aura/v1/settings`);
    } catch (err) {
      isApiUnavailable = true;
      console.warn('WordPress API unreachable, using verified settings fallback:', err);
      return VERIFIED_SETTINGS;
    }
  },

  async getHome(): Promise<HomeDto> {
    if (shouldBypassLocalApi()) return VERIFIED_HOME;
    try {
      return await fetchWithTimeout<HomeDto>(`${API_BASE}/aura/v1/home`);
    } catch (err) {
      isApiUnavailable = true;
      console.warn('WordPress API unreachable, using verified homepage fallback:', err);
      return VERIFIED_HOME;
    }
  },

  async getProductCategories(): Promise<ProductCategoryDto[]> {
    if (shouldBypassLocalApi()) return VERIFIED_CATEGORIES;
    try {
      return await fetchWithTimeout<ProductCategoryDto[]>(`${API_BASE}/aura/v1/product-categories`);
    } catch (err) {
      isApiUnavailable = true;
      console.warn('WordPress API unreachable, using verified categories fallback:', err);
      return VERIFIED_CATEGORIES;
    }
  },

  async getProducts(params: {
    category?: string;
    search?: string;
    industry?: string;
    page?: number;
    per_page?: number;
  } = {}): Promise<ProductsResponseDto> {
    const { category, search, industry, page = 1, per_page = 24 } = params;

    const getLocalFilteredProducts = () => {
      let filtered = [...VERIFIED_PRODUCTS];

      if (category && category !== 'all') {
        filtered = filtered.filter((p) => p.category.slug === category);
      }

      if (industry && industry !== 'all') {
        filtered = filtered.filter((p) =>
          p.related_industries?.some((ind) => ind.slug === industry)
        );
      }

      if (search) {
        const s = search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.chemical_name.toLowerCase().includes(s) ||
            (p.cas_number && p.cas_number.toLowerCase().includes(s)) ||
            (p.therapeutic_category && p.therapeutic_category.toLowerCase().includes(s))
        );
      }

      const total = filtered.length;
      const total_pages = Math.ceil(total / per_page);
      const start = (page - 1) * per_page;
      const pagedProducts = filtered.slice(start, start + per_page);

      return {
        total,
        total_pages,
        current_page: page,
        per_page,
        products: pagedProducts,
      };
    };

    if (shouldBypassLocalApi()) return getLocalFilteredProducts();

    try {
      const query = new URLSearchParams();
      if (category) query.set('category', category);
      if (search) query.set('search', search);
      if (industry) query.set('industry', industry);
      query.set('page', String(page));
      query.set('per_page', String(per_page));

      return await fetchWithTimeout<ProductsResponseDto>(`${API_BASE}/aura/v1/products?${query.toString()}`);
    } catch (err) {
      isApiUnavailable = true;
      console.warn('WordPress API unreachable, using verified products fallback:', err);
      return getLocalFilteredProducts();
    }
  },

  async getProduct(slug: string): Promise<ProductDto> {
    const getLocalProduct = () => {
      const found = VERIFIED_PRODUCTS.find((p) => p.slug === slug);
      if (found) return found;
      throw new ApiError(`Chemical product not found: ${slug}`, 404, 'not_found');
    };

    if (shouldBypassLocalApi()) return getLocalProduct();

    try {
      return await fetchWithTimeout<ProductDto>(`${API_BASE}/aura/v1/products/${slug}`);
    } catch (err) {
      isApiUnavailable = true;
      return getLocalProduct();
    }
  },

  async getIndustries(): Promise<IndustryDto[]> {
    if (shouldBypassLocalApi()) return VERIFIED_INDUSTRIES;

    const lookup: Record<string, string> = {
      adhesives: '/images/adhesives.jpeg',
      sealant: '/images/adhesives.jpeg',
      agro: '/images/agriculture.jpeg',
      fertilizer: '/images/agriculture.jpeg',
      automotive: '/images/automotive.jpeg',
      cleaning: '/images/cleaning.jpeg',
      sanitation: '/images/cleaning.jpeg',
      construction: '/images/constuction.jpeg',
      cosmetic: '/images/cosmetic.jpeg',
      energy: '/images/energy-sector.jpeg',
      oil: '/images/energy-sector.jpeg',
      gas: '/images/energy-sector.jpeg',
      food: '/images/food-and-bevearge.jpeg',
      beverage: '/images/food-and-bevearge.jpeg',
      healthcare: '/images/healthcare.jpeg',
      diagnostics: '/images/healthcare.jpeg',
      pharma: '/images/phrama.jpeg',
      leather: '/images/leather.jpeg',
      tanning: '/images/leather.jpeg',
      mining: '/images/mining.jpeg',
      metallurgy: '/images/mining.jpeg',
      packaging: '/images/packaging.jpeg',
      paint: '/images/paint.jpeg',
      coating: '/images/paint.jpeg',
      paper: '/images/paper.jpeg',
      pulp: '/images/paper.jpeg',
      plastic: '/images/plastics.jpeg',
      polymer: '/images/plastics.jpeg',
      semiconductor: '/images/semiconductor.jpeg',
      electronic: '/images/semiconductor.jpeg',
      textile: '/images/textind.jpeg',
      rubber: '/images/tyre.jpeg',
      tyre: '/images/tyre.jpeg',
      water: '/images/water-treatment-plant.jpg',
    };

    try {
      const data = await fetchWithTimeout<any[]>(`${API_BASE}/aura/v1/industries`);
      if (Array.isArray(data)) {
        return data.map((item) => {
          let imgUrl = item.image?.url || item.image_url || '';
          if (!imgUrl) {
            const search = ((item.slug || '') + ' ' + (item.title || '')).toLowerCase();
            for (const [k, v] of Object.entries(lookup)) {
              if (search.includes(k)) {
                imgUrl = v;
                break;
              }
            }
          }
          if (!imgUrl) imgUrl = '/images/water-treatment-plant.jpg';

          const cleanTitle = (item.title || '')
            .replace(/&amp;/g, '&')
            .replace(/&#038;/g, '&')
            .replace(/&#8211;/g, '–');

          const cleanOverview = (item.overview || '')
            .replace(/&amp;/g, '&')
            .replace(/&#038;/g, '&')
            .replace(/&#8211;/g, '–');

          return {
            id: item.id,
            slug: item.slug,
            title: cleanTitle,
            overview: cleanOverview,
            image: {
              url: imgUrl,
              alt: cleanTitle,
              width: item.image?.width || 612,
              height: item.image?.height || 408,
            },
          };
        });
      }
      return data;
    } catch (err) {
      console.warn('WordPress API unreachable, using verified industries fallback:', err);
      return VERIFIED_INDUSTRIES;
    }
  },

  async getServices(): Promise<ServiceDto[]> {
    if (shouldBypassLocalApi()) return VERIFIED_SERVICES;
    try {
      return await fetchWithTimeout<ServiceDto[]>(`${API_BASE}/aura/v1/services`);
    } catch (err) {
      isApiUnavailable = true;
      console.warn('WordPress API unreachable, using verified services fallback:', err);
      return VERIFIED_SERVICES;
    }
  },

  async getPage(slug: string): Promise<PageDto> {
    const getLocalPage = (pageSlug: string): PageDto => {
      if (pageSlug === 'about-us') {
        return {
          id: 11,
          slug: 'about-us',
          title: 'About Us',
          content_html: '',
          sections: {
            overview: 'At Aura Space Infra Private Limited, we are a trusted partner in the pharmaceutical and industrial chemical trading sector. With over a decade of industry expertise, we specialize in supplying high-purity Active Pharmaceutical Ingredients (APIs), intermediates, and specialty chemicals that comply with rigorous regulatory standards across pharmaceuticals, agrochemicals, biotechnology, and allied industries.',
            business_overview: 'Aura Space Infra Private Limited is a premier distributor and service provider of a wide range of high-quality solvents and APIs for the pharmaceutical industry, as well as other key sectors such as agrochemicals, biotechnology, food and beverage, and cosmetics. We specialize in sourcing and trading products that meet the strictest regulatory standards while catering to the ever-evolving demands of our diverse client base.',
            why_choose_us: [
              { title: 'Reliable Sourcing', description: 'Strong relationships with leading domestic manufacturers to ensure the highest quality products.' },
              { title: 'Regulatory Compliance', description: 'Strict compliance with global regulatory standards (IP, BP, USP, EP).' },
              { title: 'Diverse Product Portfolio', description: 'Wide range of solvents, APIs, and phosphates suitable for diverse industrial applications.' },
              { title: 'Customer-Centric Service', description: 'Dedicated technical desk providing tailored chemical procurement solutions.' },
              { title: 'Timely Delivery', description: 'Prioritizing on-time delivery to prevent supply chain disruptions.' }
            ],
            vision: 'At Aura Space Infra Private Limited, our vision is to be the leading trading company in the API and chemical sector, recognized for delivering exceptional products and services. We aim to provide value to our clients by sourcing and trading high-quality materials that support innovation and growth.',
            mission: 'Our mission is to provide reliable, cost-effective, and high-quality solutions to our clients. We strive to be the trusted partner of choice in the API and chemical distribution industry, continuously expanding our product offerings and services to meet the growing needs of the markets we serve.',
            sustainability: 'Sustainability is at the core of our business practices. We ensure that the products we trade are environmentally responsible and aligned with global standards for safety and sustainability. We actively work to reduce our carbon footprint across our distribution operations.',
            collaboration: 'At Aura Space Infra Pvt Ltd, we believe in the power of collaboration. We work closely with our clients, suppliers, and partners to foster innovation and drive sustainable growth.'
          }
        };
      }
      return {
        id: 15,
        slug: 'our-mission',
        title: 'Our Mission',
        content_html: '',
        sections: {
          statement: 'At Aura Space Infra Private Limited, our mission is to be the leading and most trusted chemical trading partner by delivering superior quality Active Pharmaceutical Ingredients (APIs), solvents, and specialty chemicals. We are dedicated to providing sustainable, reliable, and cost-effective chemical solutions that drive innovation and empower industries worldwide.',
          sustainability: 'Sustainability is at the heart of our mission. We are dedicated to promoting environmentally responsible practices by sourcing and distributing eco-friendly and high-performance chemicals that align with global environmental standards. Our aim is to empower industries to achieve their goals while reducing their ecological footprint.',
          innovation: 'Innovation drives our approach as we continuously seek to adopt advanced technologies, improve supply chain efficiency, and provide unparalleled customer support. We endeavor to anticipate market demands, offering competitive pricing, timely delivery, and personalized service to exceed client expectations.',
          collaboration: 'We believe in the power of collaboration, not only within our organization but also with our stakeholders. By fostering an inclusive and growth-oriented environment, we empower our team members to contribute their expertise and passion, driving our shared vision forward.',
          vision: 'At Aura Chemicals, we envision a future where we are recognized as a leading chemical trading company that balances profitability with responsibility, providing value to our clients, communities, and the planet.'
        }
      };
    };

    if (shouldBypassLocalApi()) return getLocalPage(slug);

    try {
      return await fetchWithTimeout<PageDto>(`${API_BASE}/aura/v1/pages/${slug}`);
    } catch (err) {
      console.warn('WordPress API unreachable, using verified page fallback:', err);
      return getLocalPage(slug);
    }
  },

  async submitInquiry(payload: InquiryPayload): Promise<{ success: boolean; message: string; inquiry_id?: number }> {
    try {
      const res = await fetchWithTimeout<{ success: boolean; message: string; inquiry_id?: number }>(
        `${API_BASE}/aura/v1/inquiries`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );
      if (!res.success) {
        throw new ApiError(res.message || 'Quotation submission was not confirmed by the server.', 422);
      }
      return res;
    } catch (err: any) {
      // Strict B2B Honesty Rule: Never fake success on network error or server failure.
      // Propagate honest error so form state is preserved and offline communication channels are offered.
      throw new ApiError(
        err.message || 'Unable to reach the sales desk server. Your quotation request was not transmitted.',
        err.status || 500,
        err.code || 'network_failure'
      );
    }
  },
};
