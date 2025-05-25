import { ProxycurlClient } from './proxycurl-client';

describe('ProxycurlClient Integration Tests', () => {
  let client: ProxycurlClient;
  
  beforeAll(() => {
    const apiKey = process.env.PROXYCURL_API_KEY;
    if (!apiKey) {
      console.warn('Skipping integration tests: PROXYCURL_API_KEY not set');
      return;
    }
    client = new ProxycurlClient(apiKey);
  });

  it('should fetch a real LinkedIn profile', async () => {
    if (!process.env.PROXYCURL_API_KEY) {
      console.warn('Skipping test: PROXYCURL_API_KEY not set');
      return;
    }

    // Using a well-known public profile for testing
    const profile = await client.getPersonProfile({
      linkedin_profile_url: 'https://linkedin.com/in/williamhgates',
      use_cache: 'if-present' // Use cache to avoid unnecessary API calls
    });

    expect(profile).toBeDefined();
    expect(profile.first_name).toBeTruthy();
    expect(profile.last_name).toBeTruthy();
    expect(Array.isArray(profile.experiences)).toBe(true);
    expect(Array.isArray(profile.education)).toBe(true);
  }, 30000); // 30 second timeout for API call

  it('should handle invalid profile URL gracefully', async () => {
    if (!process.env.PROXYCURL_API_KEY) {
      console.warn('Skipping test: PROXYCURL_API_KEY not set');
      return;
    }

    await expect(
      client.getPersonProfile({
        linkedin_profile_url: 'https://linkedin.com/in/this-profile-definitely-does-not-exist-12345'
      })
    ).rejects.toThrow();
  }, 30000);
});