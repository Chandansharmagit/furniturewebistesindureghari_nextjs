"use client";

import React from 'react';

export const Helmet = ({ children }) => {
  // Return null to let Next.js's native high-performance Metadata engine handle SEO on the server side
  return null;
};

export const HelmetProvider = ({ children }) => {
  return <>{children}</>;
};

export default Helmet;
