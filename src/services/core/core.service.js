import axios from 'axios';
import authService from '../auth/auth.service';

export default class CoreService {
  constructor(apiUrl) {
    this.httpClient = axios;
    this.apiUrl = apiUrl;
  }

  httpGet(url, options = {}, withAuthHeaders = true) {
    const authHeaders = withAuthHeaders ? authService.getAuthHeaders() : {};
    const defaultHeaders = {
      'Accept': 'application/ld+json',
    };
    const mergedOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...authHeaders,
        ...options.headers,
      },
    };
    return this.httpClient.get(url, mergedOptions);
  }

  httpPost(url, data, options = {}, withAuthHeaders = true) {
    const authHeaders = withAuthHeaders ? authService.getAuthHeaders() : {};
    const defaultHeaders = {
      'Content-Type': 'application/ld+json',
    };
    const mergedOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...authHeaders,
        ...options.headers,
      },
    };
    return this.httpClient.post(url, data, mergedOptions);
  }

  httpPut(url, data, options = {}, withAuthHeaders = true) {
    const authHeaders = withAuthHeaders ? authService.getAuthHeaders() : {};
    const defaultHeaders = {
      'Content-Type': 'application/ld+json',
    };
    const mergedOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...authHeaders,
        ...options.headers,
      },
    };
    return this.httpClient.put(url, data, mergedOptions);
  }

  httpPatch(url, data, options = {}, withAuthHeaders = true) {
    const authHeaders = withAuthHeaders ? authService.getAuthHeaders() : {};
    const defaultHeaders = {
      'Content-Type': 'application/merge-patch+json',
    };
    const mergedOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...authHeaders,
        ...options.headers,
      },
    };
    return this.httpClient.patch(url, data, mergedOptions);
  }

  httpDelete(url, options = {}, withAuthHeaders = true) {
    const authHeaders = withAuthHeaders ? authService.getAuthHeaders() : {};
    const mergedOptions = {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers,
      },
    };
    return this.httpClient.delete(url, mergedOptions);
  }
}