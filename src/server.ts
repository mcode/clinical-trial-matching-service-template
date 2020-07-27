// This stub handles starting the server.

import { getResponse } from './query';
import { ClinicalTrialMatchingService } from 'clinical-trial-matching-service';

const service = new ClinicalTrialMatchingService(getResponse);
service.listen();
