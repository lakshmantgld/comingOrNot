import express from 'express';
let router = express.Router();

import event from './../../models/event';

router.post('/', (req, res) => {
  let name = req.body.name;
  let personalizedDateSelection = req.body.personalizedDateSelection;
  let eventId = req.body.eventId;

  let attendee = {};
  attendee['attendeeName'] = name;
  attendee['personalizedDateSelection'] = personalizedDateSelection;

  event.update(eventId, attendee, (error, eventObj) => {
    if (error) {
      console.log(error);
      return res.status(500).send(error);
    }

    res.json(eventObj);
  });
});

module.exports = router;
