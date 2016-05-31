playCats = {};


playCats.add = function(players, categories) {
  for (var i = 0; i < players.length; i++) {
    players[i].categories = categories;
    players[i].total = 0;
  }
  return players;
} //  playCats.add

module.exports = playCats;
