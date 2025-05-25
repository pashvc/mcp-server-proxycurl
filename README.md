# Proxycurl MCP Server

An MCP (Model Context Protocol) server that integrates with [Proxycurl](https://nubela.co/proxycurl) API to enrich person and company profiles from LinkedIn, Twitter/X, and Facebook.

## Features

- 🔍 **Profile Enrichment**: Get detailed professional profiles from social media URLs
- 📧 **Contact Discovery**: Extract personal emails and phone numbers
- 💼 **Career Insights**: Access work history, education, skills, and certifications
- 💰 **Salary Intelligence**: Get inferred salary ranges based on role and company
- 🔗 **Social Profiles**: Discover GitHub, Twitter, and Facebook profiles
- 🚀 **Smart Caching**: Efficient API usage with configurable caching options

## Installation

### Prerequisites

- [Proxycurl API Key](https://nubela.co/proxycurl/pricing) (sign up for free trial)
- Node.js 18+ or Docker

### Option 1: Install from Smithery

To install Proxycurl MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/protocol/mcp-server-proxycurl):

```bash
npx @smithery/cli install @pashvc/mcp-server-proxycurl --client claude
```

### Option 2: Install for Claude Desktop

Add to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "proxycurl": {
      "command": "npx",
      "args": ["-y", "@pashvc/mcp-server-proxycurl"],
      "env": {
        "PROXYCURL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Option 3: Install for Cline

Add to your Cline MCP settings:

```json
{
  "mcpServers": {
    "proxycurl": {
      "command": "npx",
      "args": ["-y", "@pashvc/mcp-server-proxycurl"],
      "env": {
        "PROXYCURL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Option 4: Docker Installation

```bash
docker run -e PROXYCURL_API_KEY=your-api-key-here ghcr.io/pashvc/mcp-server-proxycurl
```

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/pashvc/mcp-server-proxycurl.git
cd mcp-server-proxycurl
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
PROXYCURL_API_KEY=your-api-key-here
```

4. Build the project:
```bash
npm run build
```

5. Run the MCP inspector:
```bash
npm run inspector
```

## Available Tools

### `get_person_profile`

Enriches a person's profile from LinkedIn, Twitter/X, or Facebook.

**Parameters:**
- `profile_url` (required): The social media profile URL or username
- `extra`: Include extra data (gender, birth date, industry, interests)
- `github_profile_id`: Include GitHub profile ID
- `facebook_profile_id`: Include Facebook profile ID
- `twitter_profile_id`: Include Twitter profile ID
- `personal_contact_number`: Include personal phone numbers
- `personal_email`: Include personal emails
- `inferred_salary`: Include inferred salary range
- `skills`: Include skills data
- `use_cache`: Cache usage strategy (`if-present` or `if-recent`)
- `fallback_to_cache`: Fallback behavior on errors (`on-error` or `never`)

**Example usage:**
```
Get the LinkedIn profile for johnrmarty with email and salary info
```

## Available Prompts

### `analyze-profile`
Provides comprehensive analysis of a professional profile including career trajectory, skills, and growth potential.

### `compare-candidates`
Compares multiple candidate profiles against specific role requirements.

### `enrich-contact`
Enriches a contact with all available information including emails, phone numbers, and social profiles.

### `sales-research`
Researches a prospect for sales outreach with personalized insights.

## Cost Optimization

Proxycurl charges credits per API call. Optimize costs by:

1. **Use caching**: Set `use_cache: "if-present"` to use cached data when available
2. **Select only needed fields**: Each enrichment option costs extra credits
3. **Batch operations**: Process multiple profiles efficiently

## API Credit Costs

- Base profile lookup: 1 credit
- Each enrichment option: +1 credit
- Personal emails/phones: +1 credit per item returned

## Testing

Run tests:
```bash
npm test                    # Run all tests
npm run test:integration   # Run integration tests (requires API key)
```

## License

MIT

## Support

- [Proxycurl Documentation](https://nubela.co/proxycurl/docs)
- [MCP Documentation](https://modelcontextprotocol.io)
- [Report Issues](https://github.com/pashvc/mcp-server-proxycurl/issues)