import express from 'express';
let router = express.Router();

import event from './../../models/event';

router.post('/', (req, res) => {
  console.log('coming inside the update event request handler');
  let name = req.body.name;
  let personalizedDateSelection = req.body.personalizedDateSelection;
  let eventId = req.body.eventId;

  console.log('name ' + name + '   personalizedDateSelection ' + personalizedDateSelection + '  eventId' + eventId);

  let attendee = {};
  attendee['attendeeName'] = name;
  attendee['personalizedDateSelection'] = personalizedDateSelection;

  console.log('updating ' + JSON.stringify(attendee));

  event.update(eventId, attendee, (error, eventObj) => {
    if (error) {
      console.log(error);
      return res.status(500).send(error);
    }

    console.log('successfully updated');
    console.log('and the obj is ');
    console.log(eventObj);

    res.json(eventObj);
  });
});

module.exports = router;
