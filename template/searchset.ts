import { TrialObject, SearchResponse } from './searchresponse';
import { ResearchStudy } from './research-study';
/* Handles conversion of API results to a standardized FHIR object */

export interface SearchResult {
  mode: string;
  score: number;
}

export interface SearchBundleEntry {
  resource: ResearchStudy;
  search?: SearchResult;
}

export class SearchSet {
  // static attributes
  resourceType = 'Bundle';
  type = 'searchset';
  total: number;
  entry: SearchBundleEntry[] = [];

  constructor(response: SearchResponse) {
    // TO-DO Access list of search results & total result count from object defined in searchresponse.ts
    this.total = response.totalCount;
    let index = 0;

    for (const trial of response.trials) {
      const study = new ResearchStudy(trial, index)
      this.entry.push({resource: study, search: {mode: "match", score: 1}});
      index++;
    }

  }

}
