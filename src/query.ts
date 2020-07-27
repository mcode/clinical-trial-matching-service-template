/**
 * Handles conversion of patient bundle data to a proper request for matching service apis.
 * Retrieves api response as promise to be used in conversion to fhir ResearchStudy
 */
import https from 'https';
import { IncomingMessage } from 'http';
import Configuration from "./env";
import { Bundle, Condition, ResearchStudy, SearchSet } from 'clinical-trial-matching-service';

// Generic type that represents a JSON object - that is, an object parsed from
// JSON. Note that JSON.parse is an any, this does not represent that.
type JsonObject = Record<string, unknown>;

//API RESPONSE SECTION
export class APIError extends Error {
    constructor(message: string, public result: IncomingMessage, public body: string) {
      super(message);
    }
}

//set environment variables
const environment = new Configuration().defaultEnvObject();
if (typeof environment.AUTH_TOKEN !== 'string' || environment.AUTH_TOKEN === '') {
    throw new Error('Authorization token is not set in environment. Please set AUTH_TOKEN to valid API token.');
}


/** TO-DO
 * Finish making an object for storing the various parameters necessary for the api query
 * based on a patient bundle.
 * Reference https://github.com/mcode/clinical-trial-matching-engine/wiki to see patientBundle Structures
 */
export class APIQuery {
    conditions = new Set<string>();
    zipCode?: string = null;
    travelRadius?: number = null;
    phase = 'any';
    recruitmentStatus = 'all';

     // TO-DO Add any additional fields which need to be extracted from the bundle to construct query

    constructor(patientBundle: Bundle) {
      for (const entry of patientBundle.entry) {
        if (!('resource' in entry)) {
          // Skip bad entries
          continue;
        }
        const resource = entry.resource;
        console.log(`Checking resource ${resource.resourceType}`);
        //Obtain critical search parameters
        if (resource.resourceType === 'Parameters') {
          for (const parameter of resource.parameter) {
            console.log(` - Setting parameter ${parameter.name} to ${parameter.valueString}`);
            if (parameter.name === 'zipCode') {
              this.zipCode = parameter.valueString;
            } else if (parameter.name === 'travelRadius') {
              this.travelRadius = parseFloat(parameter.valueString);
            } else if (parameter.name === 'phase') {
              this.phase = parameter.valueString;
            } else if (parameter.name === 'recruitmentStatus') {
              this.recruitmentStatus = parameter.valueString;
            }
          }
        }
        // Gather all conditions the patient has
        if (resource.resourceType === 'Condition') {
          this.addCondition(resource);
        }
        // TO-DO Extract any additional resources that you defined
      }
    }
    addCondition(condition: Condition): void {
      // Should have a code
      // TODO: Limit to specific coding systems (maybe)
      for (const code of condition.code.coding) {
        this.conditions.add(code.code);
      }
    }

    //TO-DO Utilize the extracted information to create the API query

    /**
     * Create an api request string
     * @return {string} the api query
     */
    toQuery(): string {
      const query = ` {}`;
      return query;
    }

    toString(): string {
      return this.toQuery();
    }
  }


/** Converts patient Bundle (stored within request to server) --> Promise < JSON>
 * @param reqBody The body of the request containing patient bundle data
 */

export function getResponse(patientBundle: Bundle): Promise<SearchSet> {
  return sendQuery((new APIQuery(patientBundle)).toQuery());
}

export function convertToResearchStudy(json: JsonObject, id: number): ResearchStudy {
  const result = new ResearchStudy(id);
  // Add whatever fields can be added here
  return result;
}

/**
 * Convert a JSON response into a search set
 *
 * @param json the JSON that the underlying API replied with
 */
export function convertResponseToSearchSet(json: JsonObject): SearchSet {
  // Our final response
  const studies: ResearchStudy[] = [];
  // For this example, assume that the JSON contains a single field called
  // "results" that is an array of objects that describe each matched service.
  if ('results' in json && Array.isArray(json['results'])) {
    // For generating IDs
    let id = 0;
    for (const trial of json['results']) {
      if (typeof trial === 'object') {
        studies.push(convertToResearchStudy(trial as JsonObject, id));
        id++;
      } else {
        // This is an error condition
      }
    }
  } else if ('error' in json && typeof json['error'] === 'string') {
    // For this example, assume that the API will return an error string in
    // the error field
  }
  // Generate the final SearchSet
  return new SearchSet(studies);
}

function sendQuery(query: string): Promise<SearchSet> {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(`{"query":${JSON.stringify(query)}}`, 'utf8');
    console.log('Running raw query');
    console.log(query);
    const request = https.request(environment.api_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': body.byteLength.toString(),
        'Authorization': 'Bearer ' + environment.AUTH_TOKEN //Potentially needs to be modified ?
      }
    }, result => {
      let responseBody = '';
      result.on('data', chunk => {
        responseBody += chunk;
      });
      result.on('end', () => {
        console.log('Complete');
        if (result.statusCode === 200) {
          const json = JSON.parse(responseBody) as unknown;
          if (typeof json === 'object') {
            resolve(convertResponseToSearchSet(json as JsonObject));
          } else {
            reject(new Error('Unable to parse response from server'));
          }
        } else {
          reject(new APIError(`Server returned ${result.statusCode} ${result.statusMessage}`, result, responseBody));
        }
      });
    });

    request.on('error', error => reject(error));

    request.write(body);
    request.end();
  });
}
