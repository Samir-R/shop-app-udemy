import axios from 'axios';
import authService from '../auth/auth.service';

export default class CoreService {
  constructor(apiUrl) {
    this.httpClient = axios;
    this.apiUrl = apiUrl;
  }

  httpGet(url, options = {}, withAuthHeaders = true) {
    let optionsWithUserToken = {
      headers: withAuthHeaders ? authService.getAuthHeaders() : {},
    };
    optionsWithUserToken = { ...optionsWithUserToken, ...options };
    return this.httpClient.get(url, optionsWithUserToken);
  }

  httpPost(url, data, options = {}, withAuthHeaders = true) {
    let optionsWithUserToken = {
      headers: withAuthHeaders ? authService.getAuthHeaders() : {},
    };
    optionsWithUserToken = { ...optionsWithUserToken, ...options };
    return this.httpClient.post(url, data, optionsWithUserToken);
  }

  httpPut(url, data, options = {}, withAuthHeaders = true) {
    let optionsWithUserToken = {
      headers: withAuthHeaders ? authService.getAuthHeaders() : {},
    };
    optionsWithUserToken = { ...optionsWithUserToken, ...options };
    return this.httpClient.put(url, data, optionsWithUserToken);
  }

  httpPatch(url, data, options = {}, withAuthHeaders = true) {
    let optionsWithUserToken = {
      headers: withAuthHeaders ? authService.getAuthHeaders() : {},
    };
    optionsWithUserToken = { ...optionsWithUserToken, ...options };
    return this.httpClient.patch(url, data, optionsWithUserToken);
  }

  httpDelete(url, options = {}, withAuthHeaders = true) {
    let optionsWithUserToken = {
      headers: withAuthHeaders ? authService.getAuthHeaders() : {},
    };
    optionsWithUserToken = { ...optionsWithUserToken, ...options };
    return this.httpClient.delete(url, optionsWithUserToken);
  }
}