import { IApiService } from './interfaces/IApiService';

export class ApiServiceClass implements IApiService {
  fetch<T>(endpoint:RequestInfo, init?:RequestInit): Promise<T> {
    return fetch(endpoint, init).then(resp => resp.json());
  }
}

export default new ApiServiceClass();
