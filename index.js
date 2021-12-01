'use strict';
const express = require('express');
const crypto = require('crypto');
const app = express();
app.enable('trust proxy');
const {Datastore} = require('@googlecloud/datastore');
const datastore = new Datastore();
const insertVisit = visit => {
 return datastore.save({
 key: datastore.key('visit'),
 data: visit,
 });
}; 
const getVisits = () => {
 const query = datastore
 .createQuery('visit')
 .order('timestamp', {descending: true})
 .limit(10);
 return datastore.runQuery(query);
};
app.get('/', async (req, res, next) => {
 const visit = {
 timestamp: new Date(),
 userIp: crypto
 .createHash('sha256')
 .update(req.ip)
 .digest('hex')
 .substr(0, 7),
 };
 try {
 await insertVisit(visit);
 const [entities] = await getVisits();
 const visits = entities.map(
 entity => `Time: ${entity.timestamp}, AddrHash:
${entity.userIp}`
 );
 res
 .status(200)
 .set('Content-Type', 'text/plain')
 .send(`Last 10 visits:\n${visits.join('\n')}`)
 .end();
 } catch (error) {
 next(error);
 }
}); 
const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
 console.log(`App listening on port ${PORT}`);
}); 