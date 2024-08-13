import fs from 'fs/promises';

(async () => {
  // Function to read and parse Postman collection JSON file
  const readCollection = async (filePath) => {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading file from disk: ${error}`);
    }
  };

  // Function to parse the collection to extract requests and assertions
  const parseRequests = (collection) => {
    return collection.item.map(item => {
      const request = item.request || {};
      const url = request.url || {};

      let expectedStatusCode = 200; // default to 200
      let expectedHeaders = {};
      let expectedBody = null;
      if (item.event) {
        item.event.forEach(event => {
          if (event.listen === 'test' && event.script && event.script.exec) {
            const testScript = event.script.exec.join('\n');

            // Extract status code assertion
            const statusCodeMatch = testScript.match(/pm\.response\.to\.have\.status\((\d+)\)/);
            if (statusCodeMatch) {
              expectedStatusCode = parseInt(statusCodeMatch[1], 10);
            }

            // Extract header assertions
            const headerMatches = [...testScript.matchAll(/pm\.response\.to\.have\.header\(['"]([^'"]+)['"], ['"]([^'"]+)['"]\)/g)];
            headerMatches.forEach(match => {
              expectedHeaders[match[1]] = match[2];
            });

            // Extract body content assertions (simple contains check)
            const bodyMatch = testScript.match(/pm\.response\.to\.have\.body\(['"]([^'"]+)['"]\)/);
            if (bodyMatch) {
              expectedBody = bodyMatch[1];
            }
          }
        });
      }

      return {
        name: item.name,
        method: request.method || 'GET',
        url: url.raw || '',
        headers: request.header ? request.header.reduce((acc, header) => {
          acc[header.key] = header.value;
          return acc;
        }, {}) : {},
        body: request.body ? request.body.raw : null,
        expectedStatusCode,
        expectedHeaders,
        expectedBody
      };
    });
  };

  // Function to generate test cases
  const generateTestCases = (requests) => {
    const testCases = requests.map(request => {
      const headerAssertions = Object.entries(request.expectedHeaders).map(([key, value]) => 
        `expect(response.headers()['${key.toLowerCase()}']).toBe('${value}');`
      ).join('\n        ');

      const bodyAssertion = request.expectedBody ? 
        `expect(await response.text()).toContain('${request.expectedBody}');` : '';

      return `
      test('${request.name}', async ({ request: context }) => {
        const response = await context.${request.method.toLowerCase()}('${request.url}', {
          headers: ${JSON.stringify(request.headers)},
          data: ${request.body ? JSON.stringify(request.body) : null}
        });
        expect(response.status()).toBe(${request.expectedStatusCode});
        ${headerAssertions}
        ${bodyAssertion}
      });
      `;
    }).join('\n');

    return `import { test, expect } from '@playwright/test';\n${testCases}`;
  };

  // Function to create test file from Postman collection
  const createTestFile = async (collectionPath, outputPath) => {
    try {
      const collection = await readCollection(collectionPath);
      const requests = parseRequests(collection);
      const testCases = generateTestCases(requests);
      await fs.writeFile(outputPath, testCases);
      console.log(`Test cases generated successfully in ${outputPath}`);
    } catch (error) {
      console.error(`Error writing file to disk: ${error}`);
    }
  };

  // Example usage
  await createTestFile('collections/ReqResUser.postman_collection.json', 'tests/ReqResUser.postman_collection.spec.js');
  await createTestFile('collections/FakeStore.postman_collection.json', 'tests/FakeStore.postman_collection.spec.js');
})();
