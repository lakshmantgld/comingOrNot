import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  userId: String,
  email: String
});

const User = mongoose.model('User', UserSchema);

function get(userId, callback) {
  User.find({userId: userId}, callback);
}

function saveOnce(userId, email, callback) {
  User.find({userId: userId}, function(err, res) {
    if (err) {
      return callback(err);
    }
    if (res.length > 1) {
      return callback(userId, ' is registered as more than 2 accounts.');
    } else if (res.length === 1) {
      return callback(null, res[0]);
    }

    let user = new User({userId: userId, email: email});
    user.save(callback);
  });
}

module.exports = {
  get: get,
  saveOnce: saveOnce
};
