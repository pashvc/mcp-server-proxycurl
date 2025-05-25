import { z } from 'zod';
import { ProxycurlClient } from '../services/proxycurl-client.js';
import { PersonProfile } from '../types/proxycurl.js';

const personProfileSchema = z.object({
  profile_url: z.string().describe('The profile URL (LinkedIn, Twitter/X, or Facebook) or username to look up'),
  extra: z.enum(['include', 'exclude']).optional().describe('Include extra data (gender, birth date, industry, interests) - costs 1 extra credit'),
  github_profile_id: z.enum(['include', 'exclude']).optional().describe('Include GitHub profile ID - costs 1 extra credit'),
  facebook_profile_id: z.enum(['include', 'exclude']).optional().describe('Include Facebook profile ID - costs 1 extra credit'),
  twitter_profile_id: z.enum(['include', 'exclude']).optional().describe('Include Twitter profile ID - costs 1 extra credit'),
  personal_contact_number: z.enum(['include', 'exclude']).optional().describe('Include personal phone numbers - costs 1 credit per number'),
  personal_email: z.enum(['include', 'exclude']).optional().describe('Include personal emails - costs 1 credit per email'),
  inferred_salary: z.enum(['include', 'exclude']).optional().describe('Include inferred salary range - costs 1 extra credit'),
  skills: z.enum(['include', 'exclude']).optional().describe('Include skills data - costs 1 extra credit'),
  use_cache: z.enum(['if-present', 'if-recent']).optional().describe('Cache usage: if-present (any age), if-recent (max 29 days old)'),
  fallback_to_cache: z.enum(['on-error', 'never']).optional().describe('Fallback behavior on errors')
});

export type PersonProfileInput = z.infer<typeof personProfileSchema>;

export class ProfileTool {
  private client: ProxycurlClient;

  constructor(apiKey: string) {
    this.client = new ProxycurlClient(apiKey);
  }

  async getPersonProfile(input: PersonProfileInput): Promise<PersonProfile> {
    // Extract profile URL from input
    const profileInfo = ProxycurlClient.extractProfileUrl(input.profile_url);
    
    if (!profileInfo) {
      throw new Error('Invalid profile URL or username provided. Please provide a valid LinkedIn, Twitter/X, or Facebook URL or username.');
    }

    // Build parameters based on profile type
    const params: any = {
      extra: input.extra,
      github_profile_id: input.github_profile_id,
      facebook_profile_id: input.facebook_profile_id,
      twitter_profile_id: input.twitter_profile_id,
      personal_contact_number: input.personal_contact_number,
      personal_email: input.personal_email,
      inferred_salary: input.inferred_salary,
      skills: input.skills,
      use_cache: input.use_cache,
      fallback_to_cache: input.fallback_to_cache
    };

    // Set the appropriate URL parameter
    switch (profileInfo.type) {
      case 'linkedin':
        params.linkedin_profile_url = profileInfo.url;
        break;
      case 'twitter':
        params.twitter_profile_url = profileInfo.url;
        break;
      case 'facebook':
        params.facebook_profile_url = profileInfo.url;
        break;
    }

    return await this.client.getPersonProfile(params);
  }

  static formatProfile(profile: PersonProfile): string {
    const sections = [];

    // Basic info
    sections.push(`# ${profile.full_name || 'Unknown'}`);
    if (profile.headline) sections.push(`**${profile.headline}**`);
    if (profile.city && profile.state && profile.country_full_name) {
      sections.push(`📍 ${profile.city}, ${profile.state}, ${profile.country_full_name}`);
    }
    if (profile.connections) sections.push(`🔗 ${profile.connections}+ connections`);
    
    // Summary
    if (profile.summary) {
      sections.push('\n## Summary');
      sections.push(profile.summary);
    }

    // Current position
    if (profile.experiences && profile.experiences.length > 0) {
      const current = profile.experiences.find(exp => !exp.ends_at);
      if (current) {
        sections.push('\n## Current Position');
        sections.push(`**${current.title}** at ${current.company}`);
        if (current.description) sections.push(current.description);
      }
    }

    // Education
    if (profile.education && profile.education.length > 0) {
      sections.push('\n## Education');
      profile.education.forEach(edu => {
        sections.push(`- **${edu.school}** - ${edu.degree_name || 'N/A'} in ${edu.field_of_study || 'N/A'}`);
      });
    }

    // Skills
    if (profile.skills && profile.skills.length > 0) {
      sections.push('\n## Skills');
      sections.push(profile.skills.join(', '));
    }

    // Extra info
    if (profile.extra) {
      sections.push('\n## Additional Information');
      if (profile.extra.website) sections.push(`🌐 Website: ${profile.extra.website}`);
      if (profile.extra.github_profile_id) sections.push(`💻 GitHub: @${profile.extra.github_profile_id}`);
      if (profile.extra.twitter_profile_id) sections.push(`🐦 Twitter: @${profile.extra.twitter_profile_id}`);
    }

    // Contact info
    if (profile.personal_emails && profile.personal_emails.length > 0) {
      sections.push('\n## Contact');
      sections.push(`📧 Email: ${profile.personal_emails.join(', ')}`);
    }

    if (profile.inferred_salary) {
      sections.push('\n## Salary Range');
      sections.push(`💰 $${profile.inferred_salary.min?.toLocaleString()} - $${profile.inferred_salary.max?.toLocaleString()}`);
    }

    return sections.join('\n');
  }

  getSchema() {
    return personProfileSchema;
  }
}