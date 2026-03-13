// Ad URL blocklist - Add URLs you want to block here
export const AD_BLOCKLIST = [
  // Block the specific ad URLs
  'lt.shangflayed.shop',
  'jb.bipedalpelmata.top',
  'sliwercohue.top',
];

// Function to check if a URL should be blocked
export function isAdUrlBlocked(url) {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Check if any blocked domain matches
    return AD_BLOCKLIST.some(blockedDomain => {
      return hostname.includes(blockedDomain) || url.includes(blockedDomain);
    });
  } catch (e) {
    // If URL parsing fails, check string matching
    return AD_BLOCKLIST.some(blockedDomain => url.includes(blockedDomain));
  }
}

// Function to inject redirect blocking script into iframe
export function getRedirectBlockerScript() {
  return `
    <script>
      // Intercept all navigation attempts
      window.addEventListener('beforeunload', function(e) {
        try {
          const blockedDomains = ['lt.shangflayed.shop', 'jb.bipedalpelmata.top', 'sliwercohue.top'];
          const currentUrl = window.location.href;
          
          // Check if current URL or next URL contains blocked domains
          if (blockedDomains.some(domain => currentUrl.includes(domain))) {
            console.warn('Redirect blocked:', currentUrl);
            e.preventDefault();
            e.returnValue = '';
          }
        } catch(err) {
          console.error('Error in redirect blocker:', err);
        }
      });
      
      // Block window.location changes
      const originalLocationReplace = Location.prototype.replace;
      const originalLocationAssign = Location.prototype.assign;
      
      Location.prototype.replace = function(url) {
        const blockedDomains = ['lt.shangflayed.shop', 'jb.bipedalpelmata.top', 'sliwercohue.top'];
        if (blockedDomains.some(domain => url.includes(domain))) {
          console.warn('Blocked redirect attempt to:', url);
          return;
        }
        return originalLocationReplace.call(this, url);
      };
      
      Location.prototype.assign = function(url) {
        const blockedDomains = ['lt.shangflayed.shop', 'jb.bipedalpelmata.top', 'sliwercohue.top'];
        if (blockedDomains.some(domain => url.includes(domain))) {
          console.warn('Blocked redirect attempt to:', url);
          return;
        }
        return originalLocationAssign.call(this, url);
      };
      
      // Block window.open for ad domains
      const originalOpen = window.open;
      window.open = function(url, ...args) {
        const blockedDomains = ['lt.shangflayed.shop', 'jb.bipedalpelmata.top', 'sliwercohue.top'];
        if (url && blockedDomains.some(domain => url.includes(domain))) {
          console.warn('Blocked popup to ad domain:', url);
          return null;
        }
        return originalOpen.apply(window, [url, ...args]);
      };
    </script>
  `;
}

// Function to sanitize iframe content by removing script tags that point to ad URLs
export function sanitizeIframeContent(html) {
  if (!html) return html;
  
  // Create a temporary container to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove all script tags that contain blocked ad URLs
  const scripts = temp.querySelectorAll('script');
  scripts.forEach(script => {
    if (isAdUrlBlocked(script.src) || isAdUrlBlocked(script.innerHTML)) {
      script.remove();
    }
  });
  
  return temp.innerHTML;
}
