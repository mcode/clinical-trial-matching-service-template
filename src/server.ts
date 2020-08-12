// This stub handles starting the server.

import createClinicalTrialLookup from './query';
import ClinicalTrialMatchingService, { configFromEnv } from 'clinical-trial-matching-service';
import * as dotenv from 'dotenv-flow';

// Use dotenv-flow to load local configuration from .env files
dotenv.config({
  // The environment variable to use to set the environment
  node_env: process.env.NODE_ENV,
  // The default environment to use if none is set
  default_node_env: 'development'
});

const configuration = configFromEnv('MATCHING_SERVICE_');
const getMatchingClinicalTrials = createClinicalTrialLookup(configuration);
const service = new ClinicalTrialMatchingService(getMatchingClinicalTrials, configuration);
service.listen();
