import express from 'express';
let router = express.Router();

import event from './../../models/event';

router.get('/', (req, res) => {
  const eventId = req.query.eventId;

  event.getEvent(eventId, (err, eventObj) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(eventObj);
  });
});

module.exports = router;
