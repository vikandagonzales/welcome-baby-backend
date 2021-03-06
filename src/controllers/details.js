const model = require('../models/details');

const get = (req, res, next) => {
  model.get()
    .then(data => res.status(200).send({data}))
    .catch(next);
};

const update = (req, res, next) => {
  if (
    !req.body.mother &&
    !req.body.father &&
    !req.body.host &&
    !req.body.host_contact &&
    !req.body.date &&
    !req.body.time &&
    !req.body.location &&
    !req.body.map &&
    !req.body.rsvp_date
  ) return next({status: 400, message: 'No changes to make'});
  model.update(req.body)
    .then(data => res.status(200).send({data}))
    .catch(next);
};

module.exports = {
  get,
  update
};