

/*The primary focus of this file is to define an object model matching that returned by the matching service API 

It is critical this section be completed first, as the rest of the server will utilize this definition



*/


import Configuration from "./env";





//API RESPONSE SECTION



//TO-DO create interface which reflects the json object passed back from the api
//Includes trial objects as well as additional headers/metadata
export interface SearchResponse {



}


//TO-DO Create a typescript object which matches the clinical trial JSON object from the API
export interface TrialObject {

    /* This example provides many of the common attributes of a clinical trial, modify these attributes as needed
        nctId?: string;
        title?: string;
        overallStatus?: string;
        phase?: string;
        studyType?: string;
        conditions?: string;
        keywords?: string;
        overallContactName?: string;
        overallContactPhone?: string;
        overallContactEmail?: string;
        countries?: string;
        detailedDescription?: string;
        armGroups?: ArmGroup[];
        officialTitle?: string;
        criteria?: string;
        sponsor?: string;
        overallOfficialName?: string;
        sites?: Site[];
    
        ...
    
    */
    
}






