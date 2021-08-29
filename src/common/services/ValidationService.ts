import { IValidationService } from './interfaces/IValidationService';

class ValidationService implements IValidationService {
  public validateAmountInput(value: string): boolean {
    return /^[+-]?(\d+)?\.?\d{0,2}$/.test(value);
  }
}

export default new ValidationService();
