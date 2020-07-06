
/* Handles conversion of API results to a standardized FHIR object */

import { ResearchStudy } from './research-study';
import { TrialScopeResponse, TrialScopeTrial } from './trialscope';
import { SearchResponse } from './searchresponse';

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


  
  constructor(trials: SearchResponse) {
    // TO-DO Access list of search results & total result count from object defined in searchresponse.ts
    this.total = trials.data.baseMatches.totalCount;
    let index = 0;

    for (const node of trials.data.baseMatches.edges) {
      const trial: TrialScopeTrial = node.node;
      const study = new ResearchStudy(trial, index)
      this.entry.push({resource: study, search: {mode: "match", score: 1}});
      index++;
    }

  }

}
