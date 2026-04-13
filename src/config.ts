import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "ssl-checker",
  slug: "ssl-checker",
  description: "Check SSL/TLS certificate validity, expiry, issuer, chain details, and security grade for any domain.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/check",
      price: "$0.002",
      description: "Check SSL certificate for a domain",
      toolName: "security_check_ssl",
      toolDescription: `Use this when you need to check if a domain's SSL/TLS certificate is valid, when it expires, and who issued it. Returns structured certificate data in JSON.

Returns: 1. valid (boolean) 2. expiryDate and daysRemaining 3. issuer (name, organization, country) 4. subject (CN, alt names) 5. protocol (TLS version) 6. securityGrade (A+ to F) 7. certificate chain details.

Example output: {"domain":"example.com","valid":true,"expiryDate":"2026-12-15","daysRemaining":245,"issuer":{"name":"DigiCert","organization":"DigiCert Inc"},"protocol":"TLSv1.3","securityGrade":"A+"}

Use this BEFORE deploying a website, FOR monitoring certificate expiration, auditing security posture, and validating HTTPS setup.

Do NOT use for DNS lookup -- use network_lookup_dns instead. Do NOT use for HTTP headers analysis -- use network_analyze_headers instead. Do NOT use for port scanning -- use network_scan_ports instead.`,
      inputSchema: {
        type: "object",
        properties: {
          domain: { type: "string", description: "Domain name to check SSL certificate (e.g. example.com)" },
        },
        required: ["domain"],
      },
      outputSchema: {
        type: "object",
        properties: {
          domain: { type: "string", description: "Domain checked" },
          valid: { type: "boolean", description: "Whether SSL certificate is valid" },
          issuer: { type: "object", description: "Certificate issuer details (CN, O, C)" },
          subject: { type: "object", description: "Certificate subject details (CN)" },
          validFrom: { type: "string", description: "Certificate start date" },
          validTo: { type: "string", description: "Certificate expiry date" },
          daysRemaining: { type: "number", description: "Days until certificate expires" },
          serialNumber: { type: "string", description: "Certificate serial number" },
          fingerprint: { type: "string", description: "Certificate fingerprint" },
          protocol: { type: "string", description: "TLS protocol version" },
          subjectAltNames: { type: "array", items: { type: "string" }, description: "Subject alternative names" },
          grade: { type: "string", description: "Security grade (A+ to F)" },
        },
        required: ["domain", "valid", "daysRemaining", "grade"],
      },
    },
  ],
};
