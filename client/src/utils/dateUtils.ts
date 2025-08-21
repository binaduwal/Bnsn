/**
 * Formats an ISO date string to a readable format
 * @param dateString - ISO date string (e.g., "2025-07-15T09:20:32.991+00:00")
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  options: {
    format?: 'short' | 'long' | 'relative';
    timezone?: string;
  } = {}
): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const { format = 'short', timezone } = options;

    switch (format) {
      case 'long':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: timezone,
        });

      case 'relative':
        return getRelativeTime(date);

      case 'short':
      default:
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: timezone,
        });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Gets relative time (e.g., "2 hours ago", "3 days ago")
 */
const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

/**
 * Formats date for display in tables (compact format)
 */
export const formatTableDate = (dateString: string): string => {
  return formatDate(dateString, { format: 'short' });
};

/**
 * Formats date for display with relative time
 */
export const formatRelativeDate = (dateString: string): string => {
  return formatDate(dateString, { format: 'relative' });
};

/**
 * Formats date for display in long format
 */
export const formatLongDate = (dateString: string): string => {
  return formatDate(dateString, { format: 'long' });
}; 