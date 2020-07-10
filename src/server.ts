import express from 'express';

import bodyParser from 'body-parser';
import Configuration from './env';
import { isBundle } from './bundle';
import { SearchSet } from './searchset';
import { getResponse } from './query';

const app = express();

const environment = new Configuration().defaultEnvObject();

app.use(bodyParser.json({
  // Need to increase the payload limit to receive patient bundles
  limit: "10MB"
}));

app.use(function (_req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, WU-Api-Key, WU-Api-Secret');

  next();
});

/* Default call*/
app.get('/', function (_req, res) {
  res.status(200).send('Hello from Clinical Trial');
});



/**
 * Get clinical trial results (the "main" API).
 */
app.post('/getClinicalTrial', function (req, res) {
  const postBody = req.body as Record<string, unknown>;
  if ('patientData' in postBody) {
    const patientBundle = (typeof postBody.patientData === 'string' ? JSON.parse(postBody.patientData) : postBody.patientData) as Record<string, unknown>;
    if (isBundle(patientBundle)) {
      getResponse(patientBundle).then(result => {
        const fhirResult = new SearchSet(result);
        // For debugging: dump the result out
        // console.log(JSON.stringify(fhirResult, null, 2));
        res.status(200).send(JSON.stringify(fhirResult));
      }).catch(error => {
        console.error(error);
        res.status(500).send({ error: 'Error from server', exception: Object.prototype.toString.call(error) as string });
      });
    } else {
      res.status(400).send({ error: 'Invalid patientBundle' });
    }
  } /* no support for raw searchBody now
  else if ('inputParam' in postBody) {
    // Backwards-compat: if there is no patient body, just run the query directly
    runRawTrialScopeQuery(postBody.inputParam as string).then(result => {
      res.status(200).send(result);
    }).catch(error => {
      console.error(error);
      res.status(400).send({ error: (error as Error).toString() });
    });
    return;
    
  } */
  else {
    // request missing json fields
    res.status(400).send({ error: 'Request missing required fields' });
  }
});

app.use(express.static('public'));
console.log(`Starting server on port ${environment.port}...`);
export const server = app.listen(environment.port);
export default server;