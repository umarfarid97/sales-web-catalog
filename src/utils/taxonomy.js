/**
 * VALENSZO Haute Parfumerie - Centralized Store Taxonomy Utility
 * 
 * Single Source of Truth for resolving and validating:
 * 1. Gender (strictly 3 core types: 'Women', 'Men', 'Unisex')
 * 2. Category (Fragrance Families: Woody, Floral, Oriental, Fresh, etc.)
 * 3. Concentration (Extrait de Parfum, Eau de Parfum Intense, etc.)
 */

export const TAXONOMY_TYPE = Object.freeze({
  GENDER: 'gender',
  CATEGORY: 'category',
  CONCENTRATION: 'concentration'
});

export const CORE_GENDERS = Object.freeze(['Women', 'Men', 'Unisex']);

const NON_CATEGORY_KEYWORDS = new Set([
  'men',
  'women',
  'unisex',
  'pour homme',
  'pour femme',
  'niche & unisex'
]);

/**
 * Resolves a product's gender strictly into 'Women', 'Men', or 'Unisex'.
 * Handles specs.gender, direct gender, and legacy category aliases.
 * 
 * @param {Object} product
 * @returns {'Women' | 'Men' | 'Unisex'}
 */
export const resolveProductGender = (product) => {
  if (!product) return 'Men';

  const candidates = [
    product.gender,
    product.specs?.gender,
    product.category
  ];

  for (const val of candidates) {
    if (typeof val === 'string') {
      const lower = val.toLowerCase().trim();
      if (lower === 'women' || lower === 'pour femme' || lower.includes('femme')) {
        return 'Women';
      }
      if (lower === 'unisex' || lower === 'niche & unisex' || lower.includes('unisex')) {
        return 'Unisex';
      }
      if (lower === 'men' || lower === 'pour homme' || lower.includes('homme')) {
        return 'Men';
      }
    }
  }

  return 'Men';
};

/**
 * Resolves a product's category (Fragrance Family).
 * Prioritizes olfactory family / character specifications, avoiding gender collision.
 * 
 * @param {Object} product
 * @param {string} defaultCategory
 * @returns {string}
 */
export const resolveProductCategory = (product, defaultCategory = 'Fresh / Aquatic / Citrus') => {
  if (!product) return defaultCategory;

  // 1. Direct olfactory family / character specs take precedence
  const directFamily = product.olfactoryFamily || 
                       product.specs?.olfactoryFamily || 
                       product.character || 
                       product.specs?.character;

  if (typeof directFamily === 'string') {
    const trimmed = directFamily.trim();
    if (trimmed && !NON_CATEGORY_KEYWORDS.has(trimmed.toLowerCase())) {
      return trimmed;
    }
  }

  // 2. Direct product.category if it's not a gender keyword
  if (typeof product.category === 'string') {
    const trimmed = product.category.trim();
    if (trimmed && !NON_CATEGORY_KEYWORDS.has(trimmed.toLowerCase())) {
      return trimmed;
    }
  }

  return defaultCategory;
};

/**
 * Resolves a product's concentration string.
 * 
 * @param {Object} product
 * @param {string} defaultConcentration
 * @returns {string}
 */
export const resolveProductConcentration = (product, defaultConcentration = 'Extrait de Parfum (30%)') => {
  if (!product) return defaultConcentration;

  const conc = product.concentration || product.specs?.concentration;
  if (typeof conc === 'string') {
    const trimmed = conc.trim();
    if (trimmed) return trimmed;
  }

  return defaultConcentration;
};

/**
 * Generates a clean, consistent attribute ID slug.
 * 
 * @param {'gender' | 'category' | 'concentration'} type
 * @param {string} name
 * @returns {string}
 */
export const generateAttributeId = (type, name) => {
  let prefix = 'conc';
  if (type === 'gender') prefix = 'gen';
  else if (type === 'category') prefix = 'cat';

  const slug = (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${prefix}-${slug || Date.now()}`;
};
