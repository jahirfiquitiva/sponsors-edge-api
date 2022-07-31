import type {
  SponsorsResponse,
  Sponsors,
  SponsorEntity,
  Sponsor,
  SponsorsTier,
  Tier,
} from './types';

const { GH_PAT: githubPat = '' } = process.env;

const graphQlQuery = `
{
  user(login: "jahirfiquitiva") {
    sponsorsListing {
      id
      tiers(first: 20) {
        nodes {
          ... on SponsorsTier {
            id
            adminInfo {
              sponsorships(first: 100) {
                totalRecurringMonthlyPriceInDollars
                nodes {
                  ... on Sponsorship {
                    sponsorEntity {
                      ... on User {
                        login
                        avatarUrl
                        name
                        websiteUrl
                      }
                      ... on Organization {
                        login
                        avatarUrl
                        name
                        websiteUrl
                      }
                    }
                    tierSelectedAt
                  }
                }
              }
            }
            monthlyPriceInDollars
            isOneTime
            isCustomAmount
            name
            description
          }
        }
      }
    }
    ... on Sponsorable {
      sponsors {
        totalCount
      }
    }
  }
}
`;

export const getSponsorsGraphQLResponse = async (): Promise<SponsorsResponse> => {
  return fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${githubPat}` },
    body: JSON.stringify({ query: graphQlQuery }),
  }).then((res) => res.json());
};

const transformSponsorEntityIntoSponsor = (
  entity: SponsorEntity,
  tierSelectedAt?: string
): Sponsor => {
  return {
    name: entity.name,
    username: entity.login,
    avatar: entity.avatarUrl,
    website: entity.websiteUrl,
    since: tierSelectedAt,
  };
};

const transformRawTierIntoTier = (tier: SponsorsTier): Tier => {
  return {
    id: tier.id,
    price: tier.monthlyPriceInDollars,
    isOneTime: tier.isOneTime,
    isCustomAmount: tier.isCustomAmount,
    name: tier.name,
    description: tier.description,
    totalEarningsPerMonth: tier.adminInfo?.sponsorships.totalRecurringMonthlyPriceInDollars || 0,
    sponsors: (tier.adminInfo?.sponsorships?.nodes || []).map((node) => {
      // Transform `SponsorEntity` into `Sponsor` using the `transformSponsorEntityIntoSponsor` function
      // and the `tierSelectedAt` property
      return transformSponsorEntityIntoSponsor(node.sponsorEntity, node.tierSelectedAt);
    }),
  };
};

export const transformResponseIntoSponsorships = (rawResponse: SponsorsResponse): Sponsors => {
  // Get the listing and sponsors object from the raw response.
  // We rename `sponsorsListing` to just `listing` for ease.
  // This is done locally only and does not modify the `rawResponse` object.
  const { sponsorsListing: listing, sponsors } = rawResponse.data.user;
  return {
    // Transform `SponsorsTier` into `Tier` using the `transformRawTierIntoTier` function
    tiers: listing.tiers.nodes.map(transformRawTierIntoTier),
    total: sponsors.totalCount,
  };
};
