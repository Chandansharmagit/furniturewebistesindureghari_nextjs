"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildApiUrl, PRODUCT_ENDPOINTS } from "../../config/api";
import { buildCategoryPath, flattenCategories, getCategoryProductCount, getPublicCategories, slugifyCategory } from "../../utils/categoryHelpers";
import "./CategoryLandingGrid.css";

export default function CategoryLandingGrid() {
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          fetch(buildApiUrl(PRODUCT_ENDPOINTS.CATEGORIES), { cache: "no-store" }),
          fetch(buildApiUrl(PRODUCT_ENDPOINTS.LIST), { cache: "no-store" }),
        ]);

        if (!categoryResponse.ok) return;

        const categoryData = await categoryResponse.json();
        const productData = productResponse.ok ? await productResponse.json() : [];
        const products = Array.isArray(productData) ? productData : productData.products || productData.data || [];
        const productCounts = products.reduce((counts, product) => {
          const categoryId = product.categoryId || product.category_id;
          const categoryName = product.categoryName || product.category;

          if (categoryId) {
            counts.byId.set(String(categoryId), (counts.byId.get(String(categoryId)) || 0) + 1);
          }

          if (categoryName) {
            const categorySlug = slugifyCategory(categoryName);
            counts.bySlug.set(categorySlug, (counts.bySlug.get(categorySlug) || 0) + 1);
          }

          return counts;
        }, { byId: new Map(), bySlug: new Map() });

        const applyProductCounts = (items = []) => items.map((category) => {
          const children = Array.isArray(category.children) ? applyProductCounts(category.children) : [];
          const slug = category.slug || slugifyCategory(category.name);
          const countedProducts = productCounts.byId.get(String(category.id)) ?? productCounts.bySlug.get(slug);

          return {
            ...category,
            children,
            product_count: countedProducts ?? category.product_count ?? 0,
          };
        });

        if (isMounted && Array.isArray(categoryData)) {
          setCategories(applyProductCounts(categoryData));
        }
      } catch (error) {
        console.warn("Homepage categories failed to load:", error);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const rootCategories = useMemo(() => getPublicCategories(categories), [categories]);
  const flatCategories = useMemo(() => flattenCategories(rootCategories), [rootCategories]);
  const filters = useMemo(() => [
    { id: "all", label: "All" },
    ...rootCategories.map((category) => ({ id: category.slug, label: category.name }))
  ], [rootCategories]);

  const visibleCategories = useMemo(() => {
    const list = activeFilter === "all"
      ? flatCategories
      : flatCategories.filter((category) => category.slug === activeFilter || category.parent?.slug === activeFilter);

    return list
      .filter((category) => category.status !== "inactive")
      .filter((category) => getCategoryProductCount(category) > 0)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .slice(0, 12);
  }, [activeFilter, flatCategories]);

  if (visibleCategories.length === 0) return null;

  return (
    <section className="category-landing" aria-labelledby="category-landing-title">
      <div className="category-landing-inner">
        <div className="category-landing-heading">
          <span>Shop By Category</span>
          <h2 id="category-landing-title">Find Furniture Faster</h2>
        </div>

        <div className="category-filter-row" aria-label="Category filters">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter.id}
              className={`category-filter-pill ${activeFilter === filter.id ? "active" : ""}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="category-tile-grid">
          {visibleCategories.map((category) => (
            <Link className="category-tile" href={buildCategoryPath(category, category.parent)} key={category.id}>
              <span className="category-image-wrap">
                {category.image ? (
                  <img src={category.image} alt={`${category.name} furniture collection`} loading="lazy" />
                ) : (
                  <span className="category-image-placeholder">{category.icon || category.name.charAt(0)}</span>
                )}
              </span>
              <span className="category-title">{category.name}</span>
              <span className="category-count">{getCategoryProductCount(category)} products</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
