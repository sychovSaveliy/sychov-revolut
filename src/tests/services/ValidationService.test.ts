import ValidationService from '../../common/services/ValidationService';

describe('ValidationService', () => {
  describe('validateAmountInput', () => {
    it('should return true for string - 256.56', () => {
      const valid = ValidationService.validateAmountInput('256.56');

      expect(valid).toBe(true);
    });

    it('should return true for string - 256.5', () => {
      const valid = ValidationService.validateAmountInput('256.5');

      expect(valid).toBe(true);
    });

    it('should return true for string - 256.', () => {
      const valid = ValidationService.validateAmountInput('256.');

      expect(valid).toBe(true);
    });

    it('should return true for string - 256', () => {
      const valid = ValidationService.validateAmountInput('256');

      expect(valid).toBe(true);
    });

    it('should return false for string - a256', () => {
      const valid = ValidationService.validateAmountInput('a256');

      expect(valid).toBe(false);
    });

    it('should return false for string - 256,', () => {
      const valid = ValidationService.validateAmountInput('256,');

      expect(valid).toBe(false);
    });
  });
});
