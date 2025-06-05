// Content script for extracting article content
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractArticle') {
    try {
      const articleData = extractArticleContent();
      sendResponse(articleData);
    } catch (error) {
      sendResponse({ error: error.message });
    }
  }
  return true; // Keep message channel open for async response
});

function extractArticleContent() {
  // Get basic metadata
  const metadata = {
    url: window.location.href,
    title: document.title,
    hostname: window.location.hostname,
    timestamp: new Date().toISOString()
  };

  // Try to find main article content using common selectors
  const articleSelectors = [
    'article',
    'main article',
    '[role="main"] article',
    '.post-content',
    '.entry-content',
    '.article-content',
    '.content-body',
    '#content article',
    '.story-body',
    '.article-body'
  ];

  let articleElement = null;
  for (const selector of articleSelectors) {
    articleElement = document.querySelector(selector);
    if (articleElement) break;
  }

  // If no article element found, try to get the main content area
  if (!articleElement) {
    articleElement = document.querySelector('main') || 
                    document.querySelector('[role="main"]') ||
                    document.querySelector('#content');
  }

  // Extract text content
  let textContent = '';
  if (articleElement) {
    // Clone the element to avoid modifying the page
    const clone = articleElement.cloneNode(true);
    
    // Remove script and style elements
    const scripts = clone.querySelectorAll('script, style, noscript');
    scripts.forEach(el => el.remove());
    
    // Remove common non-content elements
    const nonContentSelectors = [
      '.advertisement',
      '.ads',
      '.social-share',
      '.related-articles',
      '.comments',
      '#comments',
      '.sidebar',
      'aside',
      'nav',
      'footer'
    ];
    
    nonContentSelectors.forEach(selector => {
      const elements = clone.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
    
    textContent = clone.textContent || '';
  } else {
    // Fallback: get text from body
    const bodyClone = document.body.cloneNode(true);
    const scripts = bodyClone.querySelectorAll('script, style, noscript, nav, footer, aside');
    scripts.forEach(el => el.remove());
    textContent = bodyClone.textContent || '';
  }

  // Clean up the text
  textContent = textContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');

  // Try to extract author
  const authorSelectors = [
    '[rel="author"]',
    '.author-name',
    '.by-author',
    '.article-author',
    '[itemprop="author"]',
    '.byline'
  ];

  let author = '';
  for (const selector of authorSelectors) {
    const authorElement = document.querySelector(selector);
    if (authorElement) {
      author = authorElement.textContent.trim();
      break;
    }
  }

  // Try to extract publish date
  const dateSelectors = [
    'time[datetime]',
    '[itemprop="datePublished"]',
    '.publish-date',
    '.article-date',
    '.post-date'
  ];

  let publishDate = '';
  for (const selector of dateSelectors) {
    const dateElement = document.querySelector(selector);
    if (dateElement) {
      publishDate = dateElement.getAttribute('datetime') || 
                   dateElement.textContent.trim();
      break;
    }
  }

  // Get meta description
  const metaDescription = document.querySelector('meta[name="description"]')?.content || 
                         document.querySelector('meta[property="og:description"]')?.content || '';

  // Get featured image
  const featuredImage = document.querySelector('meta[property="og:image"]')?.content || 
                       document.querySelector('meta[name="twitter:image"]')?.content || '';

  return {
    ...metadata,
    author,
    publishDate,
    description: metaDescription,
    featuredImage,
    textContent,
    wordCount: textContent.split(/\s+/).length
  };
}