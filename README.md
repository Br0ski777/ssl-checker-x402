# SSL Checker API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://ssl-checker.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Check SSL/TLS certificate validity, expiry, issuer, chain details, and security grade for any domain. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "ssl-checker": {
      "url": "https://ssl-checker.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://ssl-checker.api.klymax402.com/api/check" \
  -H "Content-Type: application/json" \
  -d '{"domain":"..."}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `security_check_ssl` | POST | `/api/check` | $0.002 | Check SSL certificate for a domain |

### `security_check_ssl`

Use this when you need to check if a domain's SSL/TLS certificate is valid, when it expires, and who issued it. Returns structured certificate data in JSON.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `domain` | string | yes | Domain name to check SSL certificate (e.g. example.com) |

Example response:

```json
{"domain":"example.com","valid":true,"expiryDate":"2026-12-15","daysRemaining":245,"issuer":{"name":"DigiCert","organization":"DigiCert Inc"},"protocol":"TLSv1.3","securityGrade":"A+"}
```

**When to use**: deploying a website, FOR monitoring certificate expiration, auditing security posture, and validating HTTPS setup.

**Not for**: DNS lookup (use `network_lookup_dns`), HTTP headers analysis (use `network_analyze_headers`), port scanning (use `network_scan_ports`).

## Example agent prompts

- "Check if a domain's SSL/TLS certificate is valid, when it expires, and who issued it"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
