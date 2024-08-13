import { test, expect } from '@playwright/test';

      test('Get all products', async ({ request: context }) => {
        const response = await context.get('https://fakestoreapi.com/products', {
          headers: {},
          data: null
        });
        expect(response.status()).toBe(200);
        
        
      });
      

      test('Get a single product', async ({ request: context }) => {
        const response = await context.get('https://fakestoreapi.com/products/1', {
          headers: {},
          data: null
        });
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toBe('application/json');
        expect(response.headers()['cache-control']).toBe('no-store');
        
      });
      

      test('Add new product', async ({ request: context }) => {
        const response = await context.post('https://fakestoreapi.com/products', {
          headers: {},
          data: "{\"title\": \"test product\",\r\n                    \"price\": 13.5,\r\n                    \"description\": \"lorem ipsum set\",\r\n                    \"image\": \"https://i.pravatar.cc\",\r\n                    \"category\": \"electronic\"}"
        });
        expect(response.status()).toBe(200);
        
        
      });
      

      test('Update a product', async ({ request: context }) => {
        const response = await context.put('https://fakestoreapi.com/products/7', {
          headers: {},
          data: "{\"title\": \"test product\",\r\n                    \"price\": 13.5,\r\n                    \"description\": \"lorem ipsum set\",\r\n                    \"image\": \"https://i.pravatar.cc\",\r\n                    \"category\": \"electronic\"}"
        });
        expect(response.status()).toBe(200);
        
        
      });
      

      test('Update specific product', async ({ request: context }) => {
        const response = await context.patch('https://fakestoreapi.com/products/7', {
          headers: {},
          data: "{\"title\": \"test product\",\r\n                    \"price\": 13.5,\r\n                    \"description\": \"lorem ipsum set\",\r\n                    \"image\": \"https://i.pravatar.cc\",\r\n                    \"category\": \"electronic\"}"
        });
        expect(response.status()).toBe(200);
        
        
      });
      

      test('Delete a product', async ({ request: context }) => {
        const response = await context.delete('https://fakestoreapi.com/products/6', {
          headers: {},
          data: null
        });
        expect(response.status()).toBe(200);
        
        
      });
      