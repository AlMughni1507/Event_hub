export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

/**
 * Get the API base URL from environment variable or fallback to localhost
 */
export function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
}

/**
 * Get the server base URL for images and static files
 */
export function getServerBaseUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  // Remove /api from the end if present
  return apiUrl.replace(/\/api$/, '') || 'http://localhost:3000';
}

/**
 * Get the full URL for an event image
 * Handles cases where image_url might be null, undefined, or have incorrect paths
 * @param {string|null|undefined} imageUrl - The image URL from the database
 * @param {string} fallback - Fallback image URL (optional)
 * @returns {string} Full image URL
 */
export function getEventImageUrl(imageUrl, fallback = null) {
  // If no image URL provided, return fallback
  if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined' || imageUrl.trim() === '') {
    return fallback || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop';
  }

  // If already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Ensure path starts with /uploads
  let path = imageUrl.trim();
  
  // Remove leading slash if present to normalize
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  
  // If path doesn't start with uploads, add it
  if (!path.startsWith('uploads')) {
    // If it's just a filename, assume it's in events folder
    if (!path.includes('/')) {
      path = `uploads/events/${path}`;
    } else {
      path = `uploads/${path}`;
    }
  }
  
  // Ensure it starts with / for the URL
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  const serverBaseUrl = getServerBaseUrl();
  const fullUrl = `${serverBaseUrl}${path}`;
  return fullUrl;
}
