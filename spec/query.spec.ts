/**
 * This provides an example of how to test the query to ensure it produces
 * results.
 */

import { fhir } from 'clinical-trial-matching-service';
import createClinicalTrialLookup, {isQueryTrial, isQueryResponse, isQueryErrorResponse} from '../src/query';
import nock from 'nock';

describe('isQueryTrial()', () => {
  it('returns false for non-trial objects', () => {
    expect(isQueryTrial(null)).toBeFalse();
    expect(isQueryTrial(true)).toBeFalse();
    expect(isQueryTrial('string')).toBeFalse();
    expect(isQueryTrial(42)).toBeFalse();
    expect(isQueryTrial({ invalid: true })).toBeFalse();
  });

  it('returns true on a matching object', () => {
    expect(isQueryTrial({ name: 'Hello' })).toBeTrue();
  });
});

describe('isQueryResponse()', () => {
  it('returns false for non-response objects', () => {
    expect(isQueryResponse(null)).toBeFalse();
    expect(isQueryResponse(true)).toBeFalse();
    expect(isQueryResponse('string')).toBeFalse();
    expect(isQueryResponse(42)).toBeFalse();
    expect(isQueryResponse({ invalid: true })).toBeFalse();
  });

  it('returns true on a matching object', () => {
    expect(isQueryResponse({ matchingTrials: [] })).toBeTrue();
    expect(isQueryResponse({ matchingTrials: [ { name: 'Trial' }] })).toBeTrue();
    // Currently this is true. It may make sense to make it false, but for now,
    // a single invalid trial does not invalidate the array.
    expect(isQueryResponse({ matchingTrials: [ { invalid: true }] })).toBeTrue();
  });
});

describe('isQueryErrorResponse()', () => {
  it('returns false for non-response objects', () => {
    expect(isQueryErrorResponse(null)).toBeFalse();
    expect(isQueryErrorResponse(true)).toBeFalse();
    expect(isQueryErrorResponse('string')).toBeFalse();
    expect(isQueryErrorResponse(42)).toBeFalse();
    expect(isQueryErrorResponse({ invalid: true })).toBeFalse();
  });

  it('returns true on a matching object', () => {
    expect(isQueryErrorResponse({ error: 'oops' })).toBeTrue();
  });
});

describe('ClinicalTrialLookup', () => {
  let matcher: (patientBundle: fhir.Bundle) => Promise<fhir.SearchSet>;
  beforeEach(() => {
    // Create the matcher here. This creates a new instance each test so that
    // each test can adjust it as necessary without worrying about interfering
    // with other tests.
    matcher = createClinicalTrialLookup({ endpoint: 'https://www.example.com/endpoint', auth_token: 'test_token' });
  });

  it('generates a request', () => {
    nock('https://www.example.com').post('/endpoint').reply(200, { matchingTrials: [] });
    return expectAsync(matcher({resourceType: "Bundle", type: "batch", entry: []}).then(() => {
      expect(nock.isDone()).toBeTrue();
    })).toBeResolved();
  });
});
