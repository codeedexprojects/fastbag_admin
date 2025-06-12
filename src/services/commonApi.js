import axios from 'axios';

export const commonApi = async (method, url, data, options = {}) => {
  try {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
      ...options.headers, // Spread any custom headers
    };

    const response = await axios({
      method,
      url,
      data,
      headers,
    });
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    console.log(url)

    throw error;
  }
};
