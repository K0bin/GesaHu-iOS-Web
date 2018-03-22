import * as functions from 'firebase-functions'
import * as setupCors from 'cors'
import fetch from 'node-fetch'
import * as url from 'url';
const cors = setupCors({origin: true});

export const corsFunction = functions.https.onRequest((request: any, response: any) => {
  cors(request, response, () => {
    const requestUrl = request.query.url;
    let parsedUrl: url.Url | null
    try {
        //parsedUrl = new url.URL(requestUrl)
        parsedUrl = url.parse(requestUrl);
    } catch (e) {
        console.error('Cannot parse URL '+requestUrl)
        console.error(e)
        parsedUrl = null;
    }
    if (!parsedUrl || !parsedUrl.hostname || parsedUrl.hostname.indexOf('gesahui.de') === -1) {
        const hostname = parsedUrl ? parsedUrl.hostname : '';
        const error = 'Invalid URL ' + requestUrl + ' hostname: ' + hostname;
        console.error(error);
        response.status(403).send(error);
        return;
    }

    fetch(requestUrl, {
      method: request.method,
      body: request.method === 'POST' ? (request.get('content-type') === 'application/json' ? JSON.stringify(request.body) : request.body): undefined,
      headers: {
        'Content-Type': request.get('Content-Type'),
      }
    })
    .then(r => {
        if (!r.ok) {
            response.status(r.status).send('');
            throw Error("Status: " + r.statusText + " on url: "+requestUrl);
        }
        return r;
    })
    .then(r => r.headers.get('content-type') === 'application/json' ? r.json() : r.text())
    .then(body => response.status(200).send(body))
    .catch(e => console.error(e));
  });
});