# clinical-trial-matching-service-template
Template which streamlines the process of writing a server for clinical trial matching system. 

For more information on the architecture and data schemas of the clinical trial matching system, please visit the clinical-trial-matching-engine [wiki](https://github.com/mcode/clinical-trial-matching-engine/wiki).

These steps give an overview of steps you need to take to get the template into a running server

## Steps:

1. Navigate to **env.ts**. 
    - Fill in the defaults environment variables corresponding to your api service
    - Create a file in the project directory named **.env.local** and enter the following: AUTH_TOKEN = **_insert authorization token_** 
2. Open up **searchresponse.ts**. This file streamlines converting JSON responses from the API into actual objects.
    - Complete the constructors for the _TrialObject_ and _SearchResponse_ classes
        * Extract as many paramaters as possible from the JSON while adhering to the spec
    - Ensure this part is completed as it used in the rest of the server 
3. Open **query.ts**
    - Complete the _APIQuery_ class 
        * Learn more about patient bundle formatting on the [wiki](https://github.com/mcode/clinical-trial-matching-engine/wiki/Data-Model). 
        * Complete the **toQuery()** function which formats the request body sent to the matching service API. 

