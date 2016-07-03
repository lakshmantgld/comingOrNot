import express from 'express';
let router = express.Router();

import event from './../../models/event';

router.post('/', (req, res) => {
  console.log('coming inside the request');
  let name = req.body.name;
  let purpose = req.body.purpose;
  let dateArray = req.body.dateArray;

  console.log('name ' + name + '   purpose ' + purpose + '  dateArray  = ' + dateArray);


  event.save(name, purpose, dateArray, (error, eventObj) => {
    if (error) {
      console.log(error);
      return res.status(500).send(error);
    }

    console.log('successfully saved');
    console.log('and the id is ');
    console.log(eventObj._id);

    res.json({'eventId': eventObj._id});
  });
});

module.exports = router;
