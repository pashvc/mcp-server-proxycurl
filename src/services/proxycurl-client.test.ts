import { jest } from '@jest/globals';
import { ProxycurlClient } from './proxycurl-client';
import { PersonProfile } from '../types/proxycurl';

// Mock fetch globally
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('ProxycurlClient', () => {
  let client: ProxycurlClient;
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    client = new ProxycurlClient(mockApiKey);
    jest.clearAllMocks();
  });

  describe('getPersonProfile', () => {
    const mockProfile: PersonProfile = {
      public_identifier: 'johnrmarty',
      profile_pic_url: 'https://example.com/pic.jpg',
      background_cover_image_url: null,
      first_name: 'John',
      last_name: 'Marty',
      full_name: 'John Marty',
      follower_count: 500,
      occupation: 'Co-Founder at Freedom Fund Real Estate',
      headline: 'Financial Freedom through Real Estate',
      summary: 'Test summary',
      country: 'US',
      country_full_name: 'United States of America',
      city: 'Seattle',
      state: 'Washington',
      experiences: [],
      education: [],
      accomplishment_organisations: [],
      accomplishment_publications: [],
      accomplishment_honors_awards: [],
      accomplishment_patents: [],
      accomplishment_courses: [],
      accomplishment_projects: [],
      accomplishment_test_scores: [],
      volunteer_work: [],
      certifications: [],
      connections: 500,
      people_also_viewed: [],
      recommendations: [],
      activities: [],
      similarly_named_profiles: [],
      articles: [],
      groups: []
    };

    it('should fetch LinkedIn profile successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile,
      });

      const result = await client.getPersonProfile({
        linkedin_profile_url: 'https://linkedin.com/in/johnrmarty'
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('linkedin_profile_url=https%3A%2F%2Flinkedin.com%2Fin%2Fjohnrmarty'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockProfile);
    });

    it('should include optional parameters', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile,
      });

      await client.getPersonProfile({
        linkedin_profile_url: 'https://linkedin.com/in/johnrmarty',
        extra: 'include',
        personal_email: 'include',
        inferred_salary: 'include',
        use_cache: 'if-present'
      });

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('extra=include');
      expect(callUrl).toContain('personal_email=include');
      expect(callUrl).toContain('inferred_salary=include');
      expect(callUrl).toContain('use_cache=if-present');
    });

    it('should throw error when no profile URL is provided', async () => {
      await expect(client.getPersonProfile({})).rejects.toThrow(
        'At least one profile URL must be provided'
      );
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
        json: async () => ({ error: 'Unauthorized', message: 'Invalid API key' }),
      });

      await expect(
        client.getPersonProfile({ linkedin_profile_url: 'https://linkedin.com/in/test' })
      ).rejects.toThrow('Proxycurl API error: Invalid API key');
    });
  });

  describe('extractProfileUrl', () => {
    it('should extract LinkedIn URLs', () => {
      const testCases = [
        { input: 'https://www.linkedin.com/in/johnrmarty', expected: 'https://linkedin.com/in/johnrmarty' },
        { input: 'linkedin.com/in/johnrmarty', expected: 'https://linkedin.com/in/johnrmarty' },
        { input: 'johnrmarty', expected: 'https://linkedin.com/in/johnrmarty' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = ProxycurlClient.extractProfileUrl(input);
        expect(result).toEqual({ type: 'linkedin', url: expected });
      });
    });

    it('should extract Twitter/X URLs', () => {
      const testCases = [
        { input: 'https://twitter.com/elonmusk', expected: 'https://x.com/elonmusk' },
        { input: 'https://x.com/elonmusk', expected: 'https://x.com/elonmusk' },
        { input: 'x.com/elonmusk', expected: 'https://x.com/elonmusk' },
        { input: '@elonmusk', expected: 'https://x.com/elonmusk' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = ProxycurlClient.extractProfileUrl(input);
        expect(result).toEqual({ type: 'twitter', url: expected });
      });
    });

    it('should extract Facebook URLs', () => {
      const testCases = [
        { input: 'https://www.facebook.com/zuck', expected: 'https://facebook.com/zuck' },
        { input: 'facebook.com/zuck', expected: 'https://facebook.com/zuck' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = ProxycurlClient.extractProfileUrl(input);
        expect(result).toEqual({ type: 'facebook', url: expected });
      });
    });

    it('should return null for invalid URLs', () => {
      const result = ProxycurlClient.extractProfileUrl('https://invalid-website.com/profile');
      expect(result).toBeNull();
    });
  });
});