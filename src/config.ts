import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "ssl-checker",
  slug: "ssl-checker",
  description: "Check SSL certificate validity, expiry date, issuer, and certificate chain.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/check",
      price: "$0.002",
      description: "Check SSL certificate for a domain",
      toolName: "security_check_ssl",
      toolDescription: "Use this when you need to check if a domain's SSL certificate is valid, when it expires, who issued it, and the certificate chain details. Returns validity status, expiry date, days remaining, issuer info, subject, protocol, and security grade. Do NOT use for DNS lookup — use network_lookup_dns instead. Do NOT use for HTTP headers analysis — use network_analyze_headers instead.",
      inputSchema: {
        type: "object",
        properties: {
          domain: { type: "string", description: "Domain name to check SSL certificate (e.g. example.com)" },
        },
        required: ["domain"],
      },
    },
  ],
};
