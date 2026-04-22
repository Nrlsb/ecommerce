import { productSchema, cartItemSchema, loginSchema, safeValidate, searchParamsSchema } from './validation';

describe('Validation Schemas', () => {
  describe('productSchema', () => {
    it('validates correct product data', () => {
      const validProduct = {
        id: '1',
        name: 'Paint',
        price: 100,
        stock: 50,
      };

      expect(productSchema.parse(validProduct)).toEqual(validProduct);
    });

    it('rejects invalid price', () => {
      const invalidProduct = {
        id: '1',
        name: 'Paint',
        price: -100,
        stock: 50,
      };

      expect(() => productSchema.parse(invalidProduct)).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('validates correct login data', () => {
      const validLogin = {
        email: 'test@example.com',
        password: 'password123',
      };

      expect(loginSchema.parse(validLogin)).toEqual(validLogin);
    });

    it('rejects invalid email', () => {
      const invalidLogin = {
        email: 'invalid-email',
        password: 'password123',
      };

      expect(() => loginSchema.parse(invalidLogin)).toThrow();
    });

    it('rejects short password', () => {
      const invalidLogin = {
        email: 'test@example.com',
        password: '123',
      };

      expect(() => loginSchema.parse(invalidLogin)).toThrow();
    });
  });

  describe('searchParamsSchema', () => {
    it('validates partial search params', () => {
      const params = {
        q: 'paint',
        sort: 'price-asc' as const,
      };

      expect(searchParamsSchema.parse(params)).toEqual(params);
    });

    it('accepts empty params', () => {
      expect(searchParamsSchema.parse({})).toEqual({});
    });
  });

  describe('safeValidate', () => {
    it('returns parsed data on valid input', () => {
      const validProduct = {
        id: '1',
        name: 'Paint',
        price: 100,
        stock: 50,
      };

      const result = safeValidate(productSchema, validProduct);
      expect(result).toEqual(validProduct);
    });

    it('returns null on invalid input', () => {
      const invalidProduct = {
        id: '1',
        name: 'Paint',
        price: -100,
        stock: 50,
      };

      const result = safeValidate(productSchema, invalidProduct);
      expect(result).toBeNull();
    });
  });
});
