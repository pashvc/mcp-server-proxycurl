import { PersonProfile, PersonProfileParams, ProxycurlError } from '../types/proxycurl.js';

export class ProxycurlClient {
  private apiKey: string;
  private baseUrl = 'https://nubela.co/proxycurl/api/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getPersonProfile(params: PersonProfileParams): Promise<PersonProfile> {
    if (!params.linkedin_profile_url && !params.twitter_profile_url && !params.facebook_profile_url) {
      throw new Error('At least one profile URL must be provided');
    }

    const queryParams = new URLSearchParams();
    
    if (params.linkedin_profile_url) {
      queryParams.append('linkedin_profile_url', params.linkedin_profile_url);
    }
    if (params.twitter_profile_url) {
      queryParams.append('twitter_profile_url', params.twitter_profile_url);
    }
    if (params.facebook_profile_url) {
      queryParams.append('facebook_profile_url', params.facebook_profile_url);
    }

    // Add optional parameters
    if (params.extra) queryParams.append('extra', params.extra);
    if (params.github_profile_id) queryParams.append('github_profile_id', params.github_profile_id);
    if (params.facebook_profile_id) queryParams.append('facebook_profile_id', params.facebook_profile_id);
    if (params.twitter_profile_id) queryParams.append('twitter_profile_id', params.twitter_profile_id);
    if (params.personal_contact_number) queryParams.append('personal_contact_number', params.personal_contact_number);
    if (params.personal_email) queryParams.append('personal_email', params.personal_email);
    if (params.inferred_salary) queryParams.append('inferred_salary', params.inferred_salary);
    if (params.skills) queryParams.append('skills', params.skills);
    if (params.use_cache) queryParams.append('use_cache', params.use_cache);
    if (params.fallback_to_cache) queryParams.append('fallback_to_cache', params.fallback_to_cache);

    const url = `${this.baseUrl}/linkedin?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json() as ProxycurlError;
        throw new Error(`Proxycurl API error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json() as PersonProfile;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while fetching profile');
    }
  }

  /**
   * Extract profile URL from various input formats
   */
  static extractProfileUrl(input: string): { type: 'linkedin' | 'twitter' | 'facebook', url: string } | null {
    // LinkedIn patterns
    const linkedinPatterns = [
      /https?:\/\/(www\.)?linkedin\.com\/in\/([a-zA-Z0-9-_]+)/,
      /linkedin\.com\/in\/([a-zA-Z0-9-_]+)/,
      /^([a-zA-Z0-9-_]+)$/ // Just the username
    ];

    for (const pattern of linkedinPatterns) {
      const match = input.match(pattern);
      if (match) {
        const username = match[2] || match[1];
        return { type: 'linkedin', url: `https://linkedin.com/in/${username}` };
      }
    }

    // Twitter/X patterns
    const twitterPatterns = [
      /https?:\/\/(www\.)?(twitter|x)\.com\/([a-zA-Z0-9_]+)/,
      /(twitter|x)\.com\/([a-zA-Z0-9_]+)/,
      /^@([a-zA-Z0-9_]+)$/ // @username format
    ];

    for (const pattern of twitterPatterns) {
      const match = input.match(pattern);
      if (match) {
        const username = match[3] || match[2] || match[1];
        return { type: 'twitter', url: `https://x.com/${username}` };
      }
    }

    // Facebook patterns
    const facebookPatterns = [
      /https?:\/\/(www\.)?facebook\.com\/([a-zA-Z0-9.]+)/,
      /facebook\.com\/([a-zA-Z0-9.]+)/
    ];

    for (const pattern of facebookPatterns) {
      const match = input.match(pattern);
      if (match) {
        const username = match[2] || match[1];
        return { type: 'facebook', url: `https://facebook.com/${username}` };
      }
    }

    return null;
  }
}