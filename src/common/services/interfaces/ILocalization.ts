export type SupportedLanguages = 'en' | 'uk' | 'de'
export interface ILocalization {
  readonly currentLanguage: SupportedLanguages;
  readonly languages: Record<SupportedLanguages, {
    [key: string]: string | undefined;
  }>
  getString(key: string): string;
}
