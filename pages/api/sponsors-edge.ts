import type { NextRequest } from 'next/server';
import {
  getSponsorsGraphQLResponse,
  transformResponseIntoSponsorships,
} from './../../lib/sponsors/request';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  const rawResponse = await getSponsorsGraphQLResponse();
  if (rawResponse.message) {
    return new Response(JSON.stringify(rawResponse), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  return new Response(JSON.stringify(transformResponseIntoSponsorships(rawResponse)), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
