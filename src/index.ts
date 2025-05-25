#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ProfileTool } from './tools/profile-tool.js';

const server = new Server(
  {
    name: 'mcp-server-proxycurl',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
  }
);

// Initialize the profile tool
const apiKey = process.env.PROXYCURL_API_KEY;
if (!apiKey) {
  console.error('Error: PROXYCURL_API_KEY environment variable is required');
  process.exit(1);
}

const profileTool = new ProfileTool(apiKey);

// Register the person profile lookup tool
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_person_profile',
      description: 'Get enriched profile data for a person from LinkedIn, Twitter/X, or Facebook. Supports extracting contact info, social profiles, salary data, and more.',
      inputSchema: {
        type: 'object',
        properties: {
          profile_url: {
            type: 'string',
            description: 'The profile URL (LinkedIn, Twitter/X, or Facebook) or username to look up'
          },
          extra: {
            type: 'string',
            enum: ['include', 'exclude'],
            description: 'Include extra data (gender, birth date, industry, interests) - costs 1 extra credit'
          },
          github_profile_id: {
            type: 'string',
            enum: ['include', 'exclude'],
            description: 'Include GitHub profile ID - costs 1 extra credit'
          },
          facebook_profile_id: {
            type: 'string',
            enum: ['include', 'exclude'],
            description: 'Include Facebook profile ID - costs 1 extra credit'
          },
          twitter_profile_id: {
            type: 'string',
            enum: ['include', 'exclude'],
            description: 'Include Twitter profile ID - costs 1 extra credit'
          },
          personal_contact_number: {
            type: 'string',
            enum: ['include', 'exclude'],
            description: 'Include personal phone numbers - costs 1 credit per number'
          },
          personal_email: {
            type: 'string',
            enum: ['include', 'exclude'],
            description: 'Include personal emails - costs 1 credit per email'
          },
          inferred_salary: {
            type: 'string',
            enum: ['include', 'exclude'],
            description: 'Include inferred salary range - costs 1 extra credit'
          },
          skills: {
            type: 'string',
            enum: ['include', 'exclude'],
            description: 'Include skills data - costs 1 extra credit'
          },
          use_cache: {
            type: 'string',
            enum: ['if-present', 'if-recent'],
            description: 'Cache usage: if-present (any age), if-recent (max 29 days old)'
          },
          fallback_to_cache: {
            type: 'string',
            enum: ['on-error', 'never'],
            description: 'Fallback behavior on errors'
          }
        },
        required: ['profile_url']
      }
    }
  ]
}));

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_person_profile': {
        const schema = profileTool.getSchema();
        const input = schema.parse(args);
        const profile = await profileTool.getPersonProfile(input);
        
        return {
          content: [
            {
              type: 'text',
              text: ProfileTool.formatProfile(profile)
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`
        }
      ],
      isError: true
    };
  }
});

// Register prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: 'analyze-profile',
      description: 'Analyze a person\'s professional profile for insights',
      arguments: [
        {
          name: 'profile_url',
          description: 'The profile URL to analyze',
          required: true
        }
      ]
    },
    {
      name: 'compare-candidates',
      description: 'Compare multiple candidate profiles for a role',
      arguments: [
        {
          name: 'profile_urls',
          description: 'Comma-separated list of profile URLs',
          required: true
        },
        {
          name: 'role_requirements',
          description: 'Key requirements for the role',
          required: true
        }
      ]
    },
    {
      name: 'enrich-contact',
      description: 'Enrich a contact with additional information',
      arguments: [
        {
          name: 'profile_url',
          description: 'The profile URL to enrich',
          required: true
        }
      ]
    },
    {
      name: 'sales-research',
      description: 'Research a prospect for sales outreach',
      arguments: [
        {
          name: 'profile_url',
          description: 'The prospect\'s profile URL',
          required: true
        },
        {
          name: 'product_context',
          description: 'Your product/service context',
          required: false
        }
      ]
    }
  ]
}));

// Handle prompt execution
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'analyze-profile':
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please analyze the professional profile at ${args?.profile_url} and provide insights on:

1. **Career Trajectory**: Analyze their career progression and key transitions
2. **Skills & Expertise**: Identify core competencies and areas of specialization
3. **Industry Presence**: Assess their influence and standing in their field
4. **Professional Network**: Evaluate the strength and relevance of their connections
5. **Growth Potential**: Identify opportunities for career advancement
6. **Unique Strengths**: Highlight what sets this person apart

Use the get_person_profile tool with relevant enrichment options to gather comprehensive data.`
            }
          }
        ]
      };

    case 'compare-candidates':
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Compare the following candidate profiles for the role:

Profiles: ${args?.profile_urls}
Role Requirements: ${args?.role_requirements}

For each candidate:
1. Fetch their profile using get_person_profile
2. Assess fit against the role requirements
3. Identify strengths and potential gaps
4. Compare experience levels and skills
5. Provide a ranking with justification

Create a comparison table and recommendation.`
            }
          }
        ]
      };

    case 'enrich-contact':
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Enrich the contact information for: ${args?.profile_url}

Use get_person_profile with these options:
- personal_email: include
- personal_contact_number: include
- github_profile_id: include
- twitter_profile_id: include
- facebook_profile_id: include
- extra: include

Provide a comprehensive contact card with all available information.`
            }
          }
        ]
      };

    case 'sales-research':
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Research the prospect at ${args?.profile_url} for sales outreach.

${args?.product_context ? `Product/Service Context: ${args.product_context}` : ''}

Using get_person_profile, gather information to:
1. Understand their role and responsibilities
2. Identify potential pain points or needs
3. Find common connections or interests
4. Determine the best approach angle
5. Suggest personalization elements for outreach

Provide actionable insights for effective outreach.`
            }
          }
        ]
      };

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Proxycurl MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});