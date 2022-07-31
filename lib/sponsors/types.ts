export interface SponsorEntity {
  login: string;
  name?: string;
  avatarUrl: string;
  websiteUrl?: string;
}

interface Sponsorships {
  totalRecurringMonthlyPriceInDollars: number;
  nodes: Array<{
    sponsorEntity: SponsorEntity;
    tierSelectedAt: string; // TimeStamp
  }>;
}

export interface SponsorsTier {
  id: string;
  adminInfo?: {
    sponsorships: Sponsorships;
  };
  monthlyPriceInDollars: number;
  isOneTime: boolean;
  isCustomAmount: boolean;
  name: string;
  description?: string;
}

interface SponsorsListing {
  id: string;
  tiers: {
    nodes: Array<SponsorsTier>;
  };
}

export interface SponsorsResponse {
  data?: {
    user: {
      sponsorsListing: SponsorsListing;
      sponsors: {
        totalCount: number;
      };
    };
  };
  message?: string;
}

export interface Sponsor {
  username: string;
  name?: string;
  avatar: string;
  website?: string;
  since?: string;
}

export interface Tier {
  id: string;
  price: number;
  isOneTime: boolean;
  isCustomAmount: boolean;
  name: string;
  description?: string;
  totalEarningsPerMonth: number;
  sponsors: Array<Sponsor>;
}

export interface Sponsors {
  tiers: Array<Tier>;
  total: number;
}
