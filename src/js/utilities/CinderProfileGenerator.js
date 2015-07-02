var CinderProfile = require('../entities/CinderProfile.js');

var CinderProfileGenerator = function(game) {
  this.image = null;
  this.profileText = null;
};

CinderProfileGenerator.prototype.generate = function() {
  var profile = new CinderProfile();
  return profile;
};

module.exports = CinderProfile;
