// This stub handles starting the server.

import createClinicalTrialLookup from './query';
import ClinicalTrialMatchingService, { configFromEnv } from 'clinical-trial-matching-service';

const configuration = configFromEnv('MATCHING_SERVICE_');
const getMatchingClinicalTrials = createClinicalTrialLookup(configuration);
const service = new ClinicalTrialMatchingService(getMatchingClinicalTrials, configuration);
service.listen();
