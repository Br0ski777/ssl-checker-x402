import type { Hono } from "hono";
import { connect } from "tls";

export function registerRoutes(app: Hono) {
  app.post("/api/check", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body?.domain) {
      return c.json({ error: "Missing required field: domain" }, 400);
    }

    const domain: string = body.domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/:.*$/, "");

    try {
      const cert = await getCertificate(domain);
      return c.json(cert);
    } catch (e: any) {
      return c.json({ error: `SSL check failed: ${e.message}` }, 400);
    }
  });
}

interface CertResult {
  domain: string;
  valid: boolean;
  issuer: Record<string, string>;
  subject: Record<string, string>;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  serialNumber: string;
  fingerprint: string;
  protocol: string;
  subjectAltNames: string[];
  grade: string;
}

function getCertificate(domain: string): Promise<CertResult> {
  return new Promise((resolve, reject) => {
    const socket = connect(
      {
        host: domain,
        port: 443,
        servername: domain,
        rejectUnauthorized: false,
        timeout: 10000,
      },
      () => {
        try {
          const cert = (socket as any).getPeerCertificate(true);
          if (!cert || !cert.subject) {
            socket.destroy();
            return reject(new Error("No certificate returned"));
          }

          const validFrom = new Date(cert.valid_from);
          const validTo = new Date(cert.valid_to);
          const now = new Date();
          const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const isValid = (socket as any).authorized !== false && now >= validFrom && now <= validTo;

          // Parse SAN
          const sanString: string = cert.subjectaltname || "";
          const subjectAltNames = sanString
            .split(",")
            .map((s: string) => s.trim().replace("DNS:", ""))
            .filter(Boolean);

          // Grade calculation
          let grade = "A";
          if (!isValid) grade = "F";
          else if (daysRemaining < 7) grade = "D";
          else if (daysRemaining < 30) grade = "C";
          else if (daysRemaining < 90) grade = "B";

          const protocol = (socket as any).getProtocol?.() || "unknown";

          socket.destroy();
          resolve({
            domain,
            valid: isValid,
            issuer: cert.issuer || {},
            subject: cert.subject || {},
            validFrom: validFrom.toISOString(),
            validTo: validTo.toISOString(),
            daysRemaining,
            serialNumber: cert.serialNumber || "",
            fingerprint: cert.fingerprint || "",
            protocol,
            subjectAltNames,
            grade,
          });
        } catch (err: any) {
          socket.destroy();
          reject(err);
        }
      }
    );

    socket.on("error", (err: any) => {
      socket.destroy();
      reject(err);
    });

    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("Connection timed out"));
    });
  });
}
