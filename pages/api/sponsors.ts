import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getSponsorsGraphQLResponse,
  transformResponseIntoSponsorships,
} from './../../lib/sponsors/request';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawResponse = await getSponsorsGraphQLResponse();
  if (rawResponse.message) {
    return res.status(401).json(rawResponse);
  }
  return res.status(200).json(transformResponseIntoSponsorships(rawResponse));
}
