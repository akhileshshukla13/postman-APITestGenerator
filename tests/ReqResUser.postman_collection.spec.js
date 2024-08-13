import { test, expect } from '@playwright/test';

      test('create_user', async ({ request: context }) => {
        const response = await context.post('https://reqres.in/api/users', {
          headers: {},
          data: "{\r\n    \"name\": \"morpheus\",\r\n    \"job\": \"leader\"\r\n}"
        });
        expect(response.status()).toBe(201);
        
        
      });
      

      test('get_user', async ({ request: context }) => {
        const response = await context.get('https://reqres.in/api/users/2', {
          headers: {},
          data: null
        });
        expect(response.status()).toBe(200);
        
        
      });
      

      test('update_userData', async ({ request: context }) => {
        const response = await context.put('https://reqres.in/api/users/2', {
          headers: {},
          data: "{\r\n    \"name\": \"morpheus\",\r\n    \"job\": \"zion res\"\r\n}"
        });
        expect(response.status()).toBe(200);
        
        
      });
      

      test('Delete Request', async ({ request: context }) => {
        const response = await context.delete('https://reqres.in/api/users/2', {
          headers: {},
          data: null
        });
        expect(response.status()).toBe(204);
        
        
      });
      