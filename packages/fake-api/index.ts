import express from 'express';
import upcomingEvents from './data/upcoming_events.json';

const app = express();
const port = 4001;

app.get('/find/upcoming_events', (req, res) => res.send(upcomingEvents));

app.listen(port, () => console.log(`🤸‍ Fake API listening on port ${port}!`));
