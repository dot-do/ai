import { describe, it, expect } from 'vitest';
import { DB, db } from '../src/index.js';

describe('Database SDK', () => {
  describe('DB', () => {
    it('should define a database schema', () => {
      const MyDB = DB({
        User: {
          name: 'string',
          email: 'string',
          age: 'number',
        },
        Post: {
          title: 'string',
          content: 'string',
          author: 'User',
        },
      });

      expect(typeof MyDB).toBe('object');
    });
  });

  describe('db', () => {
    it('should provide CRUD operations for Things', async () => {
      const userOperations = db['User'];
      expect(userOperations).toBeDefined();
      expect(typeof userOperations?.create).toBe('function');
      expect(typeof userOperations?.get).toBe('function');
      expect(typeof userOperations?.list).toBe('function');
      expect(typeof userOperations?.update).toBe('function');
      expect(typeof userOperations?.delete).toBe('function');
    });
  });
});
