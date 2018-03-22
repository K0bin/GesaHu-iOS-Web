import * as functions from 'firebase-functions'
import * as setupCors from 'cors'
import fetch from 'node-fetch'
import * as url from 'url';
const cors = setupCors({origin: true});

export const corsFunction = functions.https.onRequest((request: any, response: any) => {
  cors(request, response, () => {
    console.log('Query:', request.query);
    console.log('Body:', request.body);

    let requestUrl = request.query.url;
    if (!requestUrl) {
        requestUrl = request.body.url;
    }
    let parsedUrl: url.Url | null
    try {
        parsedUrl = new url.URL(requestUrl)
    } catch (e) {
        parsedUrl = null;
    }
    if (!parsedUrl || !parsedUrl.hostname || parsedUrl.hostname.indexOf('gesahui.de') == -1) {
        response.status(403).send('Invalid URL');
        return;
    }
    console.log('Request:', requestUrl);

    fetch(requestUrl, {
      method: request.method,
      body: request.get('content-type') === 'application/json' ? JSON.stringify(request.body) : request.body,
      headers: {
        'Content-Type': request.get('Content-Type'),
      },
    })
    .then(r => {
        if (!r.ok) {
            response.status(r.status).send('');
            throw Error(r.statusText);
        }
        return r;
    })
    .then(r => r.text())
    .then(body => response.status(200).send(body));
  });
});