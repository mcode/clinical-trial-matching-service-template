/* Handles conversion of patient bundle data to a proper request for matching service apis.

Retrieves api response as promise to be used in conversion to fhir ResearchStudy */





//TO-DO create interface which reflects json passed back from the api
export interface SearchResponse {



}






/** Converts patient Bundle (stored within request to server) --> Promise < searchresponse>
 * @param reqBody The body of the request containing patient bundle data
 */

function getResponse(reqBody) : Promise<SearchResponse> {

    const patientBundle = (typeof reqBody.patientData === 'string' ? JSON.parse(reqBody.patientData) : reqBody.patientData) as Record<string, unknown>;
    return 0;
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