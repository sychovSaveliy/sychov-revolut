import { CurrencyAccount } from '../../constants';
import { FFMultiFetchModel } from '../../typings/ExchangeApiTypes';
import { IApiService } from './IApiService';

export interface IExchangeApiService extends IApiService {
  fetchMulti(base: CurrencyAccount): Promise<FFMultiFetchModel>; // /fetch-multi?from=USD&to=EUR,GBP
}
