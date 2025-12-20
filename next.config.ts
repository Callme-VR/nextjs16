import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    productionBrowserSourceMaps: false,
    images:{
      remotePatterns:[
        {
          hostname:"images.unsplash.com",
          protocol: "https",
          port:""
        },{
          hostname:"spotted-hyena-673.convex.cloud",
          protocol: "https",
          port:""
        }
      ]
    }

};

export default nextConfig;
