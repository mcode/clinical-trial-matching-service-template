
/*The primary focus of this file is to define an object model matching that returned by the matching service API 
*/

import { IncomingMessage } from 'http';


//API RESPONSE SECTION
export class APIError extends Error {
    constructor(message: string, public result: IncomingMessage, public body: string) {
      super(message);
    }
}

//TO-DO create class which reflects the json object passed back from the api
//Includes trial objects as well as additional headers/metadata
export class SearchResponse {
    rawJSON : JSON; //raw response from the matching service 
    totalCount?: number;
    trials?: TrialObject []=[];

    //TO-DO Add in additional fields passed back by API

    constructor(response: JSON) {

        this.rawJSON =response;

        /*TO-DO Create array of trials
        Ex: 
        let count=0;
        for (const trial in rawJSON.trials){
            trials.push(new TrialObject(trial));

            count++;
        }
        totalCount =count;

        */
    }

}
//TO-DO define dictionaries to map API returned values to enum values 
enum Status {

    closed = "closed-to-accrual",
    approved = "approved",
    active = "active",
    completed ="completed",
    disapproved="disapproved",
    inReview ="in-review",

}

enum Phase {
    NA ="n-a",
    early1= "early-phase-1",
    phase1 ="phase-1",
    phase1_2 ="phase-1-phase-2",
    phase2 = "phase-2",
    phase2_3=  "phase-2-phase-3",
    phase3 = "phase-3",
    phase4 = "phase-4",

}

export interface ArmGroup {
    description?: string;
    arm_group_type?: string;
    arm_group_label?: string;
  }
  
export interface Site {
    facility?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    latitude?: number;
    longitude?: number;
  }

//TO-DO Update the object constructor to set the fields  with values from JSON if applicable
export class TrialObject {

    //These paramaters are fairly standard among most clinical trials-- set as many as possible in the constructor
    rawTrial: JSON;
    nctId?: string; 
    title?: string;
    trialStatus?: Status; //must be set to correct enum
    phase?: Phase; //must be a valid enum
    studyType?: string; // i.e observational, interventional , randomization method ... 
    conditions?: string; //leave as continuous string i.e. `{breast cancer, depression, diabetes , ...}`
    keywords?: string;  //leave as continuous string i.e. `{estrogen receptor-positive breast cancer, stage IIIB breast cancer, ... }`
    countries?: string; //leave as continuous string i.e. `{America, France, ... }`
    contactInfo?: {name?: string, email?: string, phone?: string};
    detailedDescription?: string;
    objective?: string; //goal of the study 
    criteria?: string; //enrollment criteria 
    sponsor?: string; //sponsor name
    armGroups?: ArmGroup[];
    overallOfficialName?: string; 
    sites?: Site[];

    //TO-DO
    constructor(trial: JSON){
        this.rawTrial=trial;

    }
}






