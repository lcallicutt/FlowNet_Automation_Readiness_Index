/** @type {import('next').NextConfig} */
const nextConfig = {
  // The flownetautomation.com side redirects /readiness_index here as an
  // interim measure (a real proxy/subdomain isn't wired up yet). Since this
  // app is served at its own root, bounce that stale prefix straight to the
  // equivalent real path instead of 404ing. Temporary (307) so it's cheap
  // to remove once the domain setup is finalized.
  async redirects() {
    return [
      {
        source: "/readiness_index",
        destination: "/",
        permanent: false,
      },
      {
        source: "/readiness_index/:path*",
        destination: "/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
