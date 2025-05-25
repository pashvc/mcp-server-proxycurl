# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server that integrates with the Proxycurl API to provide profile enrichment capabilities. The server exposes tools for fetching and enriching person profiles from LinkedIn, Twitter/X, and Facebook with additional data like contact information, social profiles, and salary insights.

## Development Commands

```bash
# Build the project
npm run build

# Run tests
npm test                    # Run all tests (ESM modules with experimental VM)
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
npm run test:integration   # Run integration tests only

# Development
npm run watch              # Continuous TypeScript compilation
npm run dev                # Run with tsx in watch mode
npm run inspector          # Launch MCP Inspector for debugging
```

## Important Configuration Details

### TypeScript Configuration
- Uses ES2022 target with Node16 module system
- `isolatedModules: true` for better Jest compatibility
- Strict mode enabled for type safety

### Jest Configuration
- Uses `ts-jest` with ESM preset for ES modules support
- Tests run with `NODE_OPTIONS='--experimental-vm-modules'`
- Import jest from `@jest/globals` in test files
- Mock fetch with proper typing: `jest.fn() as jest.MockedFunction<typeof fetch>`

## Architecture

The codebase follows a clean service-oriented architecture:

- **Entry Point**: `src/index.ts` sets up the MCP server using stdio transport
- **Service Layer**: `src/services/proxycurl-client.ts` handles all Proxycurl API interactions
- **Tools Layer**: `src/tools/profile-tool.ts` wraps profile lookup operations for MCP
- **Type Definitions**: `src/types/proxycurl.ts` provides comprehensive TypeScript interfaces
- **Prompts**: Built into `src/index.ts` with pre-configured analysis prompts

## Key Implementation Details

### Profile URL Extraction
The ProxycurlClient includes smart URL extraction that handles:
- Full URLs (https://linkedin.com/in/username)
- Partial URLs (linkedin.com/in/username)
- Usernames only (username or @username for Twitter)
- Multiple social platforms (LinkedIn, Twitter/X, Facebook)

### API Integration
- Requires `PROXYCURL_API_KEY` environment variable
- Uses native fetch API for HTTP requests
- Handles the `/proxycurl/api/v2/linkedin` endpoint
- Supports all optional enrichment parameters
- Returns structured profile data with proper typing

### Cost Management
Each API call has associated credit costs:
- Base profile lookup: 1 credit
- Each enrichment option: +1 credit
- Personal emails/phones: +1 credit per item returned

### Testing Strategy
- Unit tests mock the Proxycurl API responses
- Integration tests (`*.integration.test.ts`) require actual API key
- Tests cover URL extraction, API calls, and error handling
- All tests pass with proper API key configuration

## Environment Setup

1. Create `.env` file with `PROXYCURL_API_KEY`
2. Install dependencies with `npm install`
3. Build before running: `npm run build`

## Common Issues and Solutions

### Jest ESM Module Errors
- Ensure `NODE_OPTIONS='--experimental-vm-modules'` is set in test scripts
- Import jest from `@jest/globals` not global jest
- Use `isolatedModules: true` in tsconfig.json

### URL Extraction
- Handles multiple formats: full URLs, partial URLs, usernames
- Returns null for unrecognized formats
- Normalizes all URLs to consistent format

## MCP Tools Exposed

- `get_person_profile`: Fetches and enriches person profiles with configurable data points

## MCP Prompts Available

- `analyze-profile`: Professional profile analysis
- `compare-candidates`: Multi-candidate comparison
- `enrich-contact`: Full contact information enrichment
- `sales-research`: Sales-focused prospect research