// utils/cookies.ts
export function getUserDataFromCookies(): any | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const userDataCookie = cookies.find(cookie => cookie.trim().startsWith('user-data='));
  
  if (userDataCookie) {
    try {
      const userDataString = userDataCookie.split('=')[1];
      return JSON.parse(decodeURIComponent(userDataString));
    } catch (error) {
      console.error('Error parsing user data from cookies:', error);
      return null;
    }
  }
  
  return null;
}

// Usage in your admin pages:
// const userData = getUserDataFromCookies();