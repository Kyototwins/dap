
// Re-export all match services from their respective files
export { processProfile } from './matches/profileUtils';
export { getUserMatches, getMatchById } from './matches/matchFetchService';
export { 
  enhanceMatchWithUserProfile, 
  getEnhancedMatches 
} from './matches/matchEnhancementService';
export { 
  createMatch, 
  acceptMatch, 
  rejectMatch 
} from './matches/matchOperationsService';

// Export EnhancedMatch type from matchEnhancementService
export type { EnhancedMatch } from './matches/matchEnhancementService';
