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
      expect(typeof db['User'].create).toBe('function');
      expect(typeof db['User'].get).toBe('function');
      expect(typeof db['User'].list).toBe('function');
      expect(typeof db['User'].update).toBe('function');
      expect(typeof db['User'].delete).toBe('function');
    });
  });
});
