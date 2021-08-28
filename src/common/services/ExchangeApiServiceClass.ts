import AppConfig from '../configs/AppConfig';
import { CurrencyAccount } from '../constants';
import { FFApiResponse } from '../typings/ExchangeApiTypes';
import { ApiServiceClass } from './ApiService';
import { IExchangeApiService } from './interfaces/IExchangeApiService';

export class ExchangeApiServiceClass extends ApiServiceClass implements IExchangeApiService {
  fetchMulti(base: CurrencyAccount): Promise<FFApiResponse> {
    const multiUrl = new URL(`${AppConfig.fxApi.domain}/fetch-multi`);

    multiUrl.searchParams.append('api_key', '184dd26b7e-40272d77ff-qyjq5f');
    multiUrl.searchParams.append('from', base);
    multiUrl.searchParams.append('to', 'USD,EUR,GBP');

    return fetch(multiUrl.toString()).then(resp => resp.json());
  }
}

export default new ExchangeApiServiceClass();
