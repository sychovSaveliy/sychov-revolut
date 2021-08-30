import AppConfig from '../configs/AppConfig';
import { CurrencyAccount } from '../constants';
import { FFMultiFetchModel } from '../typings/ExchangeApiTypes';
import { ApiServiceClass } from './ApiService';
import { IExchangeApiService } from './interfaces/IExchangeApiService';

export class ExchangeApiServiceClass extends ApiServiceClass implements IExchangeApiService {
  fetchMulti(base: CurrencyAccount): Promise<FFMultiFetchModel> {
    const multiUrl = new URL(`${AppConfig.fxApi.domain}/fetch-multi`);

    multiUrl.searchParams.append('api_key', process.env.REACT_APP_FF_RATES_API || '');
    multiUrl.searchParams.append('from', base);
    multiUrl.searchParams.append('to', 'USD,EUR,GBP');

    return fetch(multiUrl.toString()).then(resp => resp.json());
  }
}

export default new ExchangeApiServiceClass();
