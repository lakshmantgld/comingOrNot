import express from 'express';
let router = express.Router();

import event from './../../models/event';

router.get('/', (req, res) => {
  console.log('coming inside the fetchEvent');
  const eventId = req.query.eventId;

  event.getEvent(eventId, (err, eventObj) => {
    if (err) {
      return res.status(500).send(err);
    }
    console.log('printn the event obj');
    console.log(eventObj);
    res.json(eventObj);
  });
});

module.exports = router;
