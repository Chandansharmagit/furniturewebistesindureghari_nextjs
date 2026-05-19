"use client";

import React from 'react';
import NextLink from 'next/link';
import { useRouter, useParams as useNextParams, usePathname, useSearchParams as useNextSearchParams } from 'next/navigation';

// Mock Link wrapper to map "to" to "href"
export const Link = React.forwardRef(({ to, children, ...props }, ref) => {
  // Ensure "to" defaults to a valid href string
  const href = to || "#";
  return (
    <NextLink href={href} ref={ref} {...props}>
      {children}
    </NextLink>
  );
});

Link.displayName = 'Link';

// Mock useNavigate to match React Router v6 navigate signature
export const useNavigate = () => {
  const router = useRouter();

  return React.useCallback((to, options) => {
    if (typeof to === 'number') {
      if (to === -1) {
        router.back();
      } else if (to === 1) {
        router.forward();
      }
    } else {
      if (options && options.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    }
  }, [router]);
};

// Mock useParams to use Next.js's native useParams
export const useParams = () => {
  const params = useNextParams();
  return params || {};
};

// Mock useLocation to mimic location pathname and search params
export const useLocation = () => {
  const pathname = usePathname() || '';
  const searchParams = useNextSearchParams();
  const search = searchParams ? `?${searchParams.toString()}` : '';
  
  return {
    pathname,
    search,
    hash: typeof window !== 'undefined' ? window.location.hash : '',
    state: null
  };
};

// Mock useSearchParams to match React Router v6 hook signature
export const useSearchParams = () => {
  const nextSearchParams = useNextSearchParams();
  const setSearchParams = (newParams) => {
    console.warn("setSearchParams is a mock and not fully supported in Next.js router shim", newParams);
  };
  
  // Return the search params object (which has the .get() method) and mock setter
  return [nextSearchParams, setSearchParams];
};
