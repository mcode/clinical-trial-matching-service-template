import { Bundle, Condition } from './bundle';

/* Handles conversion of patient bundle data to a proper request for matching service apis.

Retrieves api response as promise to be used in conversion to fhir ResearchStudy */
import https from 'https';
import { SearchResponse } from "./searchresponse";
import Configuration from "./env";


const environment = new Configuration().defaultEnvObject();
if (typeof environment.AUTH_TOKEN !== 'string' || environment.AUTH_TOKEN === '') {
    throw new Error('Authorization token is not set in environment. Please set AUTH_TOKEN to valid API token.');
}



/* Patient Bundles look like this:


{
	 "resourceType": "Bundle",
	 "type": "collection",
	 "entry": [
		 {
			 "resource": {
				 "resourceType": "Parameters",
				 "parameter": [
					{
						"name": "zipCode",
						"valueString": "00000"
					},
					{
						 "name": "travelRadius",
						 "valueString": "10"
					},
					{
						 "name": "phase",
						 "valueString": "any"
					},
					{
						 "name": "recruitmentStatus",
						 "valueString": "all"
					}
				]
			}
		},
		{
			"resource": {
				"resourceType": "Patient",
				"id": "id1",
				...
			}
		},
		{
			"resource": {
				"resourceType": "Condition",
				"id": "id2",
				...
			}
		},
		{
			"resource": {
				"resourceType": "Immunization",
				"id": "id3",
				...
			}
		},
		{
			"resource": {
				"resourceType": "Encounter",
				"id": "id4",
				...
			}
		}]
}
*/

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

    /*TO-DO Add any additional fields which need to be extracted from the bundle to construct query
    */

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
        //Gather all conditions the patient has
        if (resource.resourceType === 'Condition') {
          this.addCondition(resource);
        }
        //TO-DO Extract any additional resources that are defined



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
      let query = ` {}`;
      return query;
    }

    toString(): string {
      return this.toQuery();
    }
  }
  
 


/** Converts patient Bundle (stored within request to server) --> Promise < searchresponse>
 * @param reqBody The body of the request containing patient bundle data
 */

function getResponse(reqBody) : Promise<SearchResponse> {

    const patientBundle = (typeof reqBody.patientData === 'string' ? JSON.parse(reqBody.patientData) : reqBody.patientData) as Bundle;
    let query = (new APIQuery(patientBundle)).toQuery(); 
    return sendQuery(query); 
}



function sendQuery(query: string): Promise<SearchResponse> {
    return new Promise((resolve, reject) => {
      const body = Buffer.from(`{"query":${JSON.stringify(query)}}`, 'utf8');
      console.log('Running raw TrialScope query');
      console.log(query);
      const request = https.request(environment.trialscope_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Content-Length': body.byteLength.toString(),
          'Authorization': 'Bearer ' + environment.TRIALSCOPE_TOKEN
        }
      }, result => {
        let responseBody = '';
        result.on('data', chunk => {
          responseBody += chunk;
        });
        result.on('end', () => {
          console.log('Complete');
          if (result.statusCode === 200) {
            resolve(JSON.parse(responseBody));
          } else {
            reject(new TrialScopeError(`Server returned ${result.statusCode} ${result.statusMessage}`, result, responseBody));
          }
        });
      });
  
      request.on('error', error => reject(error));
  
      request.write(body);
      request.end();
    });
  }