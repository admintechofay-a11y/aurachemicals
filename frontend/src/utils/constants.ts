/**
 * UI Label Constants (Non-Negotiable Rule 5)
 * React contains NO hard-coded business data (no phone, email, address, product,
 * client, stat, or company text). The only strings allowed are UI labels.
 */
export const UI_LABELS = {
  // Navigation & Actions
  NAV_HOME: 'Home',
  NAV_ABOUT: 'About Us',
  NAV_MISSION: 'Our Mission',
  NAV_PRODUCTS: 'Products',
  NAV_INDUSTRIES: 'Industries',
  NAV_SERVICES: 'Services',
  NAV_CONTACT: 'Contact',
  NAV_GET_A_QUOTE: 'Request a Quote',
  SKIP_TO_CONTENT: 'Skip to content',
  MENU_TOGGLE: 'Toggle Menu',
  CLOSE_MENU: 'Close Menu',

  // Common CTAs
  BTN_SUBMIT: 'Submit',
  BTN_SUBMITTING: 'Submitting...',
  BTN_SEARCH: 'Search',
  BTN_RESET: 'Reset',
  BTN_RETRY: 'Retry',
  BTN_VIEW_PRODUCT: 'View Details',
  BTN_REQUEST_QUOTE: 'Request Quote',
  BTN_EXPLORE_PRODUCTS: 'Explore Products',
  BTN_LEARN_MORE: 'Learn More',
  BTN_DOWNLOAD_COA: 'Download Technical COA/MSDS',
  BTN_BACK_TO_PRODUCTS: 'Back to Product Catalog',

  // Search & Filter
  SEARCH_PLACEHOLDER: 'Search by Chemical Name or CAS Number...',
  FILTER_ALL_CATEGORIES: 'All Categories',
  FILTER_ALL_INDUSTRIES: 'All Industries',
  TABLE_HEADER_PRODUCT: 'Product / Chemical',
  TABLE_HEADER_CAS: 'CAS Number',
  TABLE_HEADER_CATEGORY: 'Therapeutic / Chemical Category',
  TABLE_HEADER_GRADE: 'Grade / Specifications',
  TABLE_HEADER_ACTION: 'Action',

  // Form Fields & Labels
  FORM_NAME_LABEL: 'Representative Name',
  FORM_NAME_PLACEHOLDER: 'Your full name',
  FORM_COMPANY_LABEL: 'Company / Organization',
  FORM_COMPANY_PLACEHOLDER: 'Corporate / firm name',
  FORM_EMAIL_LABEL: 'Corporate Email',
  FORM_EMAIL_PLACEHOLDER: 'procurement@company.com',
  FORM_PHONE_LABEL: 'Phone / WhatsApp',
  FORM_PHONE_PLACEHOLDER: '+91 98000 00000',
  FORM_PRODUCT_LABEL: 'Product / Chemical Required',
  FORM_PRODUCT_PLACEHOLDER: 'Select chemical or enter requirement',
  FORM_QUANTITY_LABEL: 'Estimated Volume / Quantity',
  FORM_QUANTITY_PLACEHOLDER: 'e.g. 500 kg, 5 MT, Drum',
  FORM_REQUIREMENT_LABEL: 'Specifications / Notes',
  FORM_REQUIREMENT_PLACEHOLDER: 'Specify grade (IP/BP/USP/Tech), CAS number, packaging preferences...',
  FORM_CONSENT_LABEL: 'I confirm that this quotation inquiry is for commercial / industrial procurement.',
  FORM_SUCCESS_TITLE: 'Inquiry Successfully Submitted',
  FORM_SUCCESS_MESSAGE: 'Thank you. Your quotation request has been transmitted directly to our procurement and sales desk. We will revert with pricing and CoA details.',

  // States & Errors
  LOADING_TEXT: 'Loading information from verified catalog...',
  EMPTY_PRODUCTS_TITLE: 'No Chemicals Found',
  EMPTY_PRODUCTS_DESC: 'No products currently match the selected search criteria or filter.',
  ERROR_GENERIC_TITLE: 'System Communication Notice',
  ERROR_GENERIC_DESC: 'Unable to synchronize with the technical product catalog. Please verify your connection or retry.',
  NOT_FOUND_TITLE: 'Page Not Found',
  NOT_FOUND_DESC: 'The requested technical document or page route does not exist.',

  // Footer Titles
  FOOTER_COMPANY: 'Corporate Identity',
  FOOTER_PRODUCTS: 'Chemical Categories',
  FOOTER_INDUSTRIES: 'Industries Served',
  FOOTER_CONTACT: 'Direct Inquiries',
} as const;
