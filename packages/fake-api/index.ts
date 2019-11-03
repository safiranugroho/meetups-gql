import express from 'express';
import upcomingEvents from './sample-data/upcoming_events.json';

const app = express();
const port = 4001;

app.get('/find/upcoming_events', (req, res) => res.send(JSON.stringify(upcomingEvents)));

app.listen(port, () => console.log(`🤸‍ Fake API listening on port ${port}!`));
