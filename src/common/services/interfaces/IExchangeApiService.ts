import { CurrencyAccount } from '../../constants';
import { FFApiResponse } from '../../typings/ExchangeApiTypes';
import { IApiService } from './IApiService';

export interface IExchangeApiService extends IApiService {
  fetchMulti(base: CurrencyAccount): Promise<FFApiResponse>; // /fetch-multi?from=USD&to=EUR,GBP
}
