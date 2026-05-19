import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['react-router-dom'] = path.resolve(__dirname, 'src/utils/routerShim.js');
    config.resolve.alias['react-helmet'] = path.resolve(__dirname, 'src/utils/helmetShim.js');
    config.resolve.alias['react-helmet-async'] = path.resolve(__dirname, 'src/utils/helmetShim.js');
    return config;
  }
};

export default nextConfig;
