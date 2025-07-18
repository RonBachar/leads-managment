export const APP_CONSTANTS = {
  // Application
  APP_NAME: 'מערכת ניהול לידים',
  APP_VERSION: '1.0.0',

  // Navigation
  ROUTES: {
    CLIENTS: '/clients',
    CLIENTS_NEW: '/clients/new',
    CLIENTS_EDIT: '/clients/edit',
  },

  // Form Validation
  VALIDATION: {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    PHONE_PATTERN: /^[0-9\-\+\(\)\s]+$/,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    DOMAIN_PATTERN: /^[a-zA-Z0-9][a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}$/,
    PRICE_PATTERN: /^\d+(\.\d{1,2})?$/,
    MIN_PRICE: 1,
    MAX_FILE_SIZE: 10485760, // 10MB
  },

  // File Upload
  FILE_UPLOAD: {
    ALLOWED_TYPES: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    MAX_SIZE: 10485760, // 10MB
  },

  // Localization
  LOCALE: {
    DEFAULT: 'he',
    DIRECTION: 'rtl',
    SUPPORTED: ['he', 'en'],
  },
} as const;

export const PACKAGE_LABELS: Record<string, string> = {
  'ללא חבילה': 'ללא חבילה',
  HOSTING: 'אחסון',
  ELEMENTOR_PRO: 'Elementor Pro',
  HOSTING_ELEMENTOR_PRO: 'אחסון + Elementor Pro',
} as const;
