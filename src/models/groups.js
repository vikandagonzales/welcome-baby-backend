const db = require('../../db');

const getAll = () => {
  return db('groups')
    .orderBy('id', 'asc')
    .then(groups => {
      const promises = groups.map(group => {
        return db('guests')
          .orderBy('id', 'asc')
          .where({group_id: group.id})
          .then(guests => {
            group.guests = guests;
            return group;
          });
      });
      return Promise.all(promises);
    });
};

const getOne = id => {
  return db('groups')
    .where({id: id})
    .first()
    .then(group => {
      return db('guests')
        .orderBy('id', 'asc')
        .where({group_id: group.id})
        .then(guests => {
          group.guests = guests;
          return group;
        });
    });
};

const create = ({name, limit}) => {
  return db('groups')
    .insert({name, limit})
    .returning('*')
    .then(([data]) => {
      return data;
    });
};

const update = async (id, {name, limit}) => {
  const group = await getOne(id);
  if (group.guests.length > limit) throw {status: 400, message: 'Current guests exceed limit'};
  const updated = {};
  name ? updated.name = name : null;
  limit ? updated.limit = limit : null;
  return db('groups')
    .update(updated)
    .where({id: id})
    .returning('*')
    .then(([data]) => {
      return data;
    });
};

const remove = id => {
  return db('groups')
    .del()
    .where({id: id})
    .returning('*')
    .then(([data]) => {
      delete data.id;
      return data;
    });
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove
};