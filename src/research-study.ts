import * from './trialbackup';

/*
This file contains a basic implementation of a FHIR ResearchStudy resource and supporting interfaces
The class can be expanded meeting the specifications outlined at https://www.hl7.org/fhir/researchstudy.html
Should your matching service not provide a necessary attribute, use trialbackup.ts fill it in, if there is nothing to
full in from the backup, leave the attribute out of your FHIR ResearchStudy entirely
*/

// FHIR data types supporting ResearchStudy
export interface Identifier{
  use?: string;
  system?: string;
  value?: string;
}

export interface CodeableConcept {
  coding?: {system?: string; code?: string; display?: string;}[]
  text?: string;
}

export interface ContactDetail {
  name?: string;
  telecom?: Telecom[];
}

export interface Telecom {
  system?: string;
  value?: string;
  use?: string;
}

export interface Arm {
  name?: string;
  type?: CodeableConcept;
  description?: string;
}

export interface Objective {
  name?: string;
  type?: CodeableConcept;
}

export interface Reference {
  reference?: string;
  type?: string;
  display?: string;
}

// FHIR resources contained within ResearchStudy
export interface Group {
  resourceType?: string
  id?: string;
  type?: string;
  actual?: boolean;
}

export interface Location {
  resourceType?: string
  id?: string;
  name?: string;
  telecom?: Telecom[];
  position?: {longitude?: number; latitude?: number};
}

export interface Organization {
  resourceType?: string
  id?: string;
  name?: string;
}

export interface Practitioner {
  resourceType?: string
  id?: string;
  name?: HumanName[];
}

// FHIR data types supporting resources contained in ResearchStudy
export interface HumanName {
  use?: string;
  text: string;
}

// ResearchStudy implementation
export class ResearchStudy { // still needs parameter specific notes for UI requirements
  resourceType = 'ResearchStudy';
  id?: string;
  identifier?: Identifier[];
  title?: string;
  status?: string;
  phase?: CodeableConcept; //
  category?: CodeableConcept[];
  condition?: CodeableConcept[];
  contact?: ContactDetail[];
  keyword?: CodeableConcept[];
  location?: CodeableConcept[];
  description?: string; // Should actually be markdown
  arm?: Arm[];
  objective?: Objective[];
  enrollment?: Reference[];
  sponsor?: Reference;
  principalInvestigator?: Reference;
  site?: Reference[];
  contained?: (Group | Location | Organization | Practitioner)[]; //

  constructor(trial, id: number) {

    /*
    Set as many of the above parameters as possible
    The following parameters are required for the UI:
    - Title
    - Summary
    - Site location
    - Phase
    - Contact Information i.e. sponsor email, phone number
    - Study Type
    - Inclusion/ Exclusion criteria
    If your service does not return a necessary attribute, leverage the code in trialbackup.ts with the trial's nctId
    to find the required information.
    Write your constructor such that if the information cannot be found the response from your match service or in the
    trialbackup system, the parameter is left out of the ResearchStudy object entirely
    */

    this.id = String(id);
  }
}


