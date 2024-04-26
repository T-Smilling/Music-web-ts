import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const apiUrl = 'https://api.example.com/data';

  try {
    const apiResponse = await fetch(apiUrl);

    if (apiResponse.ok) {
      const data = await apiResponse.json();
      return response.status(200).json(data);
    } else {
      // Properly return an error response
      return response.status(apiResponse.status).json({
        message: `Failed to fetch data. API returned ${apiResponse.status}`,
      });
    }
  } catch (error) {
    // Forget to return an HTTP response, leading to a function timeout
    console.error(`Error fetching data from ${apiUrl}: ${error}`);
  }
}