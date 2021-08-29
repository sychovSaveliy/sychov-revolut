import { ILocalization, SupportedLanguages } from './interfaces/ILocalization';

class Localization implements ILocalization {
  currentLanguage: SupportedLanguages = 'en';
  getString(key: string): string {
    // TODO: Index signatures fix
    // @ts-ignore
    return this.languages[this.currentLanguage][key];
  }

  languages = {
    en: {
      'ExchangeButton.LabelFirstPart': 'Sell',
      'ExchangeButton.LabelSecondPart': 'for',
      'ExchangeButton.LabelBuyFirstPart': 'Buy',
      'ExchangeButton.LabelBuySecondPart': 'with',
      'AmountInput.ExceedBalance': 'exceeds balance',
      'AmountInput.BalanceLabel': 'Balance: '
    },
    uk: {},
    de: {}
  }
}

export default new Localization();
