import express from 'express';
import upcomingEvents from './data/upcoming_events.json';

const app = express();
const port = 4001;

app.get('/find/upcoming_events', (req, res) => {
  if (req.query.topic_category === '292') {
    res.status(200).send(upcomingEvents);
  } else {
    res.status(404).send({ message: 'Topic category query is missing!' });
  }
});

app.listen(port, () => console.log(`🤸‍ Fake API listening on port ${port}!`));
