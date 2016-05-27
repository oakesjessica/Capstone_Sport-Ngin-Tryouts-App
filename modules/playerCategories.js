var random = require("./randomCode")
playCats = {};


playCats.add = function(players, categories) {
  for (var i = 0; i < players.length; i++) {
    players[i].player_id = random.createAccessCode();
    players[i].categories = categories;
  }
  return players;
} //  playCats.add

module.exports = playCats;
