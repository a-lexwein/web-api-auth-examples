const _ = require('underscore');

// Here are the keys in track   [ 'album', 'artists', 'available_markets', 'disc_number', 'duration_ms', 'explicit', 'external_ids', 'external_urls', 'href', 'id', 'name', 'popularity', 'preview_url', 'track_number', 'type', 'uri' ]
// I'll be a little redundant

const payloadToSongArray = (body) => {
  const played_at =  _.pluck(body.items, 'played_at');
  let tracks =  _.pluck(body.items, 'track');

  for (let i = 0; i < body.items.length; i++) {
    tracks[i].played_at = played_at[i];
  }

  tracks = tracks.map(trackToRow);

  let artists = _.flatten(tracks.map(trackArtists));

  tracks = tracks.map(x => _.omit(x, 'artists'));

  tracks.forEach(x => {
    x.name =  x.name.split("'").join("''");
  })

  return {tracks, artists};

}

const keep = ['name', 'id', 'artists', 'duration_ms', 'played_at'];
trackToRow = track => _.pick(track, ...keep);

trackArtists = track => {
  let id = track.id;
  let artists = track.artists;

//  return _.extend(_.pick(artists, 'name', 'id'), {'track_id': track.id})
//  return _.pick(artists, 'name', 'id')
return artists.map(x => _.pick(x, 'name', 'id'));
}


module.exports = payloadToSongArray;
