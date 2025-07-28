export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).length;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const calculateReadingTime = (text: string, wordsPerMinute: number = 200): number => {
  const wordCount = countWords(text);
  return Math.ceil(wordCount / wordsPerMinute);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Function to count words in generated content (excluding HTML tags and comments)
export const countGeneratedWords = (content: string): number => {
  if (!content || typeof content !== 'string') return 0;
  
  // Remove HTML tags
  const withoutHtml = content.replace(/<[^>]*>/g, '');
  
  // Remove HTML comments
  const withoutComments = withoutHtml.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove email separators and metadata
  const cleanContent = withoutComments
    .replace(/<!-- Email \d+ -->/gi, '')
    .replace(/<!--\s*Subject:\s*.*?-->/gi, '')
    .replace(/<!--\s*Preheader:\s*.*?-->/gi, '')
    .replace(/<title[^>]*>.*?<\/title>/gi, '')
    .replace(/<html[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '');
  
  // Count words in the cleaned content
  return countWords(cleanContent);
};

// Function to update user word count
export const updateUserWordCount = async (userId: string, generatedContent: string, User: any): Promise<{ success: boolean; wordsUsed: number; wordsLeft: number; wordsInContent: number }> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Count words in the generated content
    const wordsInContent = countGeneratedWords(generatedContent);
    
    // Update user's word count
    user.wordsUsed += wordsInContent;
    user.wordsLeft = Math.max(0, user.totalWords - user.wordsUsed);
    
    await user.save();
    
    return {
      success: true,
      wordsUsed: user.wordsUsed,
      wordsLeft: user.wordsLeft,
      wordsInContent
    };
  } catch (error) {
    console.error('Error updating user word count:', error);
    throw error;
  }
};

/**
 * Extract common styling patterns from homepage HTML
 * @param homepageHtml - The homepage HTML content
 * @returns Object containing extracted styling patterns
 */
export const extractHomepageStyling = (homepageHtml: string) => {
  const styling = {
    colors: {
      primary: '',
      secondary: '',
      accent: '',
      text: '',
      background: ''
    },
    typography: {
      h1: '',
      h2: '',
      h3: '',
      p: '',
      body: ''
    },
    layout: {
      container: '',
      section: '',
      header: '',
      footer: ''
    },
    spacing: {
      margin: '',
      padding: ''
    }
  };

  try {
    // Extract color patterns
    const colorMatches = homepageHtml.match(/color:\s*([^;]+)/gi);
    if (colorMatches) {
      const colors = colorMatches.map(match => match.replace(/color:\s*/i, '').trim());
      styling.colors.primary = colors[0] || '#1f2937';
      styling.colors.secondary = colors[1] || '#3b82f6';
      styling.colors.accent = colors[2] || '#10b981';
      styling.colors.text = colors[3] || '#374151';
    }

    // Extract background colors
    const bgMatches = homepageHtml.match(/background-color:\s*([^;]+)/gi);
    if (bgMatches) {
      styling.colors.background = bgMatches[0]?.replace(/background-color:\s*/i, '').trim() || '#ffffff';
    }

    // Extract typography patterns
    const h1Matches = homepageHtml.match(/<h1[^>]*style="[^"]*font-size:\s*([^;]+)/gi);
    if (h1Matches) {
      styling.typography.h1 = h1Matches[0]?.match(/font-size:\s*([^;]+)/i)?.[1]?.trim() || '2.5rem';
    }

    const h2Matches = homepageHtml.match(/<h2[^>]*style="[^"]*font-size:\s*([^;]+)/gi);
    if (h2Matches) {
      styling.typography.h2 = h2Matches[0]?.match(/font-size:\s*([^;]+)/i)?.[1]?.trim() || '2rem';
    }

    const h3Matches = homepageHtml.match(/<h3[^>]*style="[^"]*font-size:\s*([^;]+)/gi);
    if (h3Matches) {
      styling.typography.h3 = h3Matches[0]?.match(/font-size:\s*([^;]+)/i)?.[1]?.trim() || '1.5rem';
    }

    // Extract layout patterns
    const containerMatches = homepageHtml.match(/<div[^>]*style="[^"]*max-width:\s*([^;]+)/gi);
    if (containerMatches) {
      styling.layout.container = containerMatches[0]?.match(/max-width:\s*([^;]+)/i)?.[1]?.trim() || '1200px';
    }

    // Extract spacing patterns
    const marginMatches = homepageHtml.match(/margin:\s*([^;]+)/gi);
    if (marginMatches) {
      styling.spacing.margin = marginMatches[0]?.replace(/margin:\s*/i, '').trim() || '1rem';
    }

    const paddingMatches = homepageHtml.match(/padding:\s*([^;]+)/gi);
    if (paddingMatches) {
      styling.spacing.padding = paddingMatches[0]?.replace(/padding:\s*/i, '').trim() || '1rem';
    }

  } catch (error) {
    console.error('Error extracting styling from homepage:', error);
  }

  return styling;
};

/**
 * Apply homepage styling to new page content
 * @param newPageHtml - The new page HTML content
 * @param homepageStyling - The extracted homepage styling
 * @returns Updated HTML with applied styling
 */
export const applyHomepageStyling = (newPageHtml: string, homepageStyling: any) => {
  let updatedHtml = newPageHtml;

  try {
    // Apply color scheme
    if (homepageStyling.colors.primary) {
      updatedHtml = updatedHtml.replace(
        /color:\s*#[0-9a-fA-F]{6}/g,
        `color: ${homepageStyling.colors.primary}`
      );
    }

    if (homepageStyling.colors.secondary) {
      updatedHtml = updatedHtml.replace(
        /background-color:\s*#[0-9a-fA-F]{6}/g,
        `background-color: ${homepageStyling.colors.secondary}`
      );
    }

    // Apply typography
    if (homepageStyling.typography.h1) {
      updatedHtml = updatedHtml.replace(
        /<h1[^>]*style="[^"]*font-size:\s*[^;]+/gi,
        (match) => match.replace(/font-size:\s*[^;]+/i, `font-size: ${homepageStyling.typography.h1}`)
      );
    }

    if (homepageStyling.typography.h2) {
      updatedHtml = updatedHtml.replace(
        /<h2[^>]*style="[^"]*font-size:\s*[^;]+/gi,
        (match) => match.replace(/font-size:\s*[^;]+/i, `font-size: ${homepageStyling.typography.h2}`)
      );
    }

    if (homepageStyling.typography.h3) {
      updatedHtml = updatedHtml.replace(
        /<h3[^>]*style="[^"]*font-size:\s*[^;]+/gi,
        (match) => match.replace(/font-size:\s*[^;]+/i, `font-size: ${homepageStyling.typography.h3}`)
      );
    }

    // Apply layout
    if (homepageStyling.layout.container) {
      updatedHtml = updatedHtml.replace(
        /<div[^>]*style="[^"]*max-width:\s*[^;]+/gi,
        (match) => match.replace(/max-width:\s*[^;]+/i, `max-width: ${homepageStyling.layout.container}`)
      );
    }

    // Apply spacing
    if (homepageStyling.spacing.margin) {
      updatedHtml = updatedHtml.replace(
        /margin:\s*[^;]+/gi,
        `margin: ${homepageStyling.spacing.margin}`
      );
    }

    if (homepageStyling.spacing.padding) {
      updatedHtml = updatedHtml.replace(
        /padding:\s*[^;]+/gi,
        `padding: ${homepageStyling.spacing.padding}`
      );
    }

  } catch (error) {
    console.error('Error applying homepage styling:', error);
  }

  return updatedHtml;
};

/**
 * Generate styling reference prompt for AI services
 * @param homepageStyling - The extracted homepage styling
 * @returns Formatted prompt for AI services
 */
export const generateStylingReferencePrompt = (homepageStyling: any) => {
  return `
## 🎨 Styling Reference from Homepage
Use these styling patterns to maintain visual consistency:

### Colors:
- Primary: ${homepageStyling.colors.primary}
- Secondary: ${homepageStyling.secondary}
- Accent: ${homepageStyling.colors.accent}
- Text: ${homepageStyling.colors.text}
- Background: ${homepageStyling.colors.background}

### Typography:
- H1: ${homepageStyling.typography.h1}
- H2: ${homepageStyling.typography.h2}
- H3: ${homepageStyling.typography.h3}

### Layout:
- Container max-width: ${homepageStyling.layout.container}
- Default margin: ${homepageStyling.spacing.margin}
- Default padding: ${homepageStyling.spacing.padding}

Apply these styles consistently throughout the page to match the homepage design.
`;
};