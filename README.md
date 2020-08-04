# clinical-trial-matching-service-template
Template which streamlines the process of writing a server for clinical trial matching system.

For more information on the architecture and data schemas of the clinical trial matching system, please visit the clinical-trial-matching-engine [wiki](https://github.com/mcode/clinical-trial-matching-engine/wiki).

These steps give an overview of steps you need to take to get the template into a running server that will send requests to the underlying matching service.

## Basic Steps:

1. Open `src/query.ts`. This file contains a stub implementation of the query mapper - the function that receives a FHIR Bundle of patient data and uses it to look up matching clinical trials.
    - The `createClinicalTrialLookup()` function creates the underlying function used. It creates a closure over the necessary configuration information, and handles creating a new `APIQuery` object based on patient data and then calling `sendQuery()` to send the actual query.
    - Edit `APIQuery` to pull any necessary information out of the patient data and its `toQuery()` function to generate an appropriate query. Learn more about the patient bundle that will be sent [in the matching engine wiki](https://github.com/mcode/clinical-trial-matching-engine/wiki/Data-Model).
    - Fill out your `QueryResponse` and `QueryTrial` types to match what the service returns.
    - Modify `QueryErrorResponse` and `sendQuery()` to handle errors returned by the service.
2. Open `src/researchstudy-mapping.ts`. This file contains a single function: `convertToResearchStudy` function, which handles converting individual trials as returned from the underlying service into FHIR ResearchStudy objects. While the stub is small, the bulk of additional code is likely to be in here.
3. Open `src/server.ts`. This contains the code to start the service, as well as load configuration data. The default is very simplistic, it simply loads configuration via `configFromEnv()` and passes it off to the `createClinicalTrialLookup()` function. The [dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow) package may be useful for loading configuration information from files.

You may need to further tweek the code stubs provided, and there are other ways to implement a service implemenation. (For example, you could simply extend `ClinicalTrialMatchingService` and pass it a matcher that invokes a method on the generated class.) However the steps above should provide the basic stubs necessary to generate an implementation of a matching service.

# Requirements

The ResearchStudy object passed back by this server must be [FHIR-compliant] (https://www.hl7.org/fhir/researchstudy.html) and satisfy several requirements.
Study must contain:
- Title
- Summary
- Site location
- Phase
- Contact Information i.e. sponsor email, phone number
- Study Type
- Inclusion/ Exclusion criteria

# Running the Server

Note that at present, two environment variables must be set before the server will start: `MATCHING_SERVICE_ENDPOINT` and `MATCHING_SERVICE_AUTH_TOKEN`. If neither are set, the service will raise an error.

1. Run `npm install`
2. Run `npm start`
3. The service will now be running at http://localhost:3000/

# Testing

A validation test is provided to validate the ResearchStudy created via this service. Put an example response object in `spec/data/trial_object.json` and this object will be loaded and validated within this test. For this test to run, you must:

1. Have a Java runtime environment installed
2. [Download a copy of the HL7 validator JAR] (https://storage.googleapis.com/ig-build/org.hl7.fhir.validator.jar) into `spec/data/org.hl7.fhir.validator.jar`
3. Have properly filled out `spec/data/trial_object.json`
4. Have implemented the conversion function in `src/researchstudy-mapping.ts`