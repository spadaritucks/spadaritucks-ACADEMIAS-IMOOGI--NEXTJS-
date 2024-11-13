/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '',
    assetPrefix: '',
    output: 'export',
    

    images: {
        domains: ['localhost', 'https://academiasimoogi.com.br'],
        unoptimized: true,
      },
};





export default nextConfig;

