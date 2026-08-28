import type {
  DiscoveredArticle,
} from "../../../../shared/services/discoveryApi";

import type {
  RecommendedArticle,
} from "../../../../shared/services/recommendationApi";

import type {
  TrendingArticle,
} from "../../../../shared/services/trendingApi";


export interface PersonalizedDashboardData {
  recommendations:
    RecommendedArticle[];

  discovery:
    DiscoveredArticle[];

  trending:
    TrendingArticle[];
}


export interface PersonalizedDashboardErrors {
  recommendations:
    string | null;

  discovery:
    string | null;

  trending:
    string | null;
}