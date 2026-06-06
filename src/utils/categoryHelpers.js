export const slugifyCategory = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const titleFromSlug = (slug = '') =>
  String(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const flattenCategories = (categories = [], parent = null, list = []) => {
  categories.forEach((category) => {
    const item = {
      ...category,
      parent,
      slug: category.slug || slugifyCategory(category.name),
    };

    list.push(item);

    if (Array.isArray(category.children) && category.children.length > 0) {
      flattenCategories(category.children, item, list);
    }
  });

  return list;
};

export const findCategoryBySlug = (categories = [], slug = '') => {
  const normalizedSlug = slugifyCategory(slug);
  return flattenCategories(categories).find((category) => category.slug === normalizedSlug) || null;
};

export const buildCategoryPath = (category, parent = null) => {
  const categorySlug = category.slug || slugifyCategory(category.name);

  if (parent) {
    const parentSlug = parent.slug || slugifyCategory(parent.name);
    return `/category/${parentSlug}/${categorySlug}`;
  }

  return `/category/${categorySlug}`;
};

export const getCategoryProductCount = (category = {}) => {
  const rawCount = category.product_count ?? category.productCount ?? category.products_count ?? 0;
  const count = Number(rawCount);

  return Number.isFinite(count) ? count : 0;
};

export const hasPublicProducts = (category = {}) => {
  const children = Array.isArray(category.children) ? category.children : [];

  return getCategoryProductCount(category) > 0 || children.some(hasPublicProducts);
};

export const getPublicCategories = (categories = []) =>
  categories
    .filter((category) => category.status !== 'inactive')
    .map((category) => {
      const children = Array.isArray(category.children) ? getPublicCategories(category.children) : [];

      return {
        ...category,
        children,
      };
    })
    .filter(hasPublicProducts);

export const mapCategoriesToNavigation = (categories = []) =>
  getPublicCategories(categories).map((category) => {
    const slug = category.slug || slugifyCategory(category.name);
    const children = Array.isArray(category.children) ? category.children : [];

    return {
      id: category.id,
      name: category.name,
      slug,
      path: `/category/${slug}`,
      desc: category.metaDescription || category.seoDescription || `Browse ${category.name} products`,
      subLinks: children.map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug || slugifyCategory(child.name),
        path: `/category/${slug}/${child.slug || slugifyCategory(child.name)}`,
        desc: child.metaDescription || child.seoDescription || `Shop ${child.name}`,
      })),
    };
  });
