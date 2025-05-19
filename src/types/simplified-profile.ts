
/**
 * Simplified version of the Profile type to prevent circular references
 * Contains only essential properties needed for display in match context
 */
export interface SimplifiedProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  age: number | null;
  gender: string | null;
  origin: string | null;
  about_me: string | null;
  university: string | null;
  department: string | null;
  languages: string[] | null;
  learning_languages: string[] | null;
  language_levels: Record<string, number>;
  hobbies: string[] | null;
}
