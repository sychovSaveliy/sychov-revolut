export interface IApiService {
  fetch<T>(endpoint: RequestInfo, init?: RequestInit): Promise<T>;
}
