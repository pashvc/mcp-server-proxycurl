export interface Date {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface Experience {
  starts_at: Date | null;
  ends_at: Date | null;
  company: string | null;
  company_linkedin_profile_url: string | null;
  company_facebook_profile_url: string | null;
  title: string | null;
  description: string | null;
  location: string | null;
  logo_url: string | null;
}

export interface Education {
  starts_at: Date | null;
  ends_at: Date | null;
  field_of_study: string | null;
  degree_name: string | null;
  school: string | null;
  school_linkedin_profile_url: string | null;
  school_facebook_profile_url: string | null;
  description: string | null;
  logo_url: string | null;
  grade: string | null;
  activities_and_societies: string | null;
}

export interface Language {
  name: string;
  proficiency: 'ELEMENTARY' | 'LIMITED_WORKING' | 'PROFESSIONAL_WORKING' | 'FULL_PROFESSIONAL' | 'NATIVE_OR_BILINGUAL' | null;
}

export interface AccomplishmentOrg {
  starts_at: Date | null;
  ends_at: Date | null;
  org_name: string;
  title: string | null;
  description: string | null;
}

export interface Publication {
  name: string | null;
  publisher: string | null;
  published_on: Date | null;
  description: string | null;
  url: string | null;
}

export interface HonourAward {
  title: string | null;
  issuer: string | null;
  issued_on: Date | null;
  description: string | null;
}

export interface Patent {
  title: string | null;
  issuer: string | null;
  issued_on: Date | null;
  description: string | null;
  application_number: string | null;
  patent_number: string | null;
  url: string | null;
}

export interface Course {
  name: string | null;
  number: string | null;
}

export interface Project {
  starts_at: Date | null;
  ends_at: Date | null;
  title: string | null;
  description: string | null;
  url: string | null;
}

export interface TestScore {
  name: string | null;
  score: string | null;
  date_on: Date | null;
  description: string | null;
}

export interface VolunteeringExperience {
  starts_at: Date | null;
  ends_at: Date | null;
  title: string | null;
  cause: string | null;
  company: string | null;
  company_linkedin_profile_url: string | null;
  description: string | null;
  logo_url: string | null;
}

export interface Certification {
  starts_at: Date | null;
  ends_at: Date | null;
  name: string | null;
  license_number: string | null;
  display_source: string | null;
  authority: string | null;
  url: string | null;
}

export interface PeopleAlsoViewed {
  link: string | null;
  name: string | null;
  summary: string | null;
  location: string | null;
}

export interface Activity {
  title: string | null;
  link: string | null;
  activity_status: string | null;
}

export interface SimilarProfile {
  name: string | null;
  link: string | null;
  summary: string | null;
  location: string | null;
}

export interface Article {
  title: string | null;
  link: string | null;
  published_date: Date | null;
  author: string | null;
  image_url: string | null;
}

export interface PersonGroup {
  profile_pic_url: string | null;
  name: string | null;
  url: string | null;
}

export interface InferredSalary {
  min: number | null;
  max: number | null;
}

export interface PersonExtra {
  github_profile_id: string | null;
  facebook_profile_id: string | null;
  twitter_profile_id: string | null;
  website: string | null;
}

export interface PersonProfile {
  public_identifier: string | null;
  profile_pic_url: string | null;
  background_cover_image_url: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  follower_count: number | null;
  occupation: string | null;
  headline: string | null;
  summary: string | null;
  country: string | null;
  country_full_name: string | null;
  city: string | null;
  state: string | null;
  experiences: Experience[];
  education: Education[];
  languages_and_proficiencies?: Language[];
  accomplishment_organisations: AccomplishmentOrg[];
  accomplishment_publications: Publication[];
  accomplishment_honors_awards: HonourAward[];
  accomplishment_patents: Patent[];
  accomplishment_courses: Course[];
  accomplishment_projects: Project[];
  accomplishment_test_scores: TestScore[];
  volunteer_work: VolunteeringExperience[];
  certifications: Certification[];
  connections: number | null;
  people_also_viewed: PeopleAlsoViewed[];
  recommendations: string[];
  activities: Activity[];
  similarly_named_profiles: SimilarProfile[];
  articles: Article[];
  groups: PersonGroup[];
  inferred_salary?: InferredSalary;
  gender?: string | null;
  birth_date?: Date | null;
  industry?: string | null;
  extra?: PersonExtra;
  interests?: string[];
  personal_emails?: string[];
  personal_numbers?: string[];
  skills?: string[];
}

export interface PersonProfileParams {
  linkedin_profile_url?: string;
  twitter_profile_url?: string;
  facebook_profile_url?: string;
  extra?: 'include' | 'exclude';
  github_profile_id?: 'include' | 'exclude';
  facebook_profile_id?: 'include' | 'exclude';
  twitter_profile_id?: 'include' | 'exclude';
  personal_contact_number?: 'include' | 'exclude';
  personal_email?: 'include' | 'exclude';
  inferred_salary?: 'include' | 'exclude';
  skills?: 'include' | 'exclude';
  use_cache?: 'if-present' | 'if-recent';
  fallback_to_cache?: 'on-error' | 'never';
}

export interface ProxycurlError {
  error: string;
  message: string;
}