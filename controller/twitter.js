var Twit = require('twit');

var Twitter = {};

var T = new Twit({
  consumer_key:         'aKBfx7nzbvZairBaSehKeH3sj',
  consumer_secret:      'CyPbxnFx1qiW5ztzM8b10Rye9nB4ng7SJR3bHExkS6muWZo2sS',
  access_token:         '607071332-jTzorFFp0KLczwXDgyMd2kmaw0XJ0MQnMeF4Xhko',
  access_token_secret:  'XSRxsaKgTl1icODM5c05zxoWDINB86Dg7x8ZUSAUUqOqf',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

var tweets = tweets || {};
tweets.messages = [];

var stream = T.stream('statuses/filter', { locations: [-122, 26, -68, 50]});

Twitter.on = function(cb){
  stream.on('tweet', function(tweet){
      if (tweet.coordinates !== null){
        var message = {};
        message.name = tweet.user.name;
        message.location = tweet.user.location;
        message.des = tweet.user.description;
        message.img = tweet.user.profile_image_url;
        message.coord = tweet.coordinates.coordinates;
        tweets.messages.push(message);
        cb(tweets.messages);
      }
  });
};

Twitter.restart = function(){
  stream.start();
};

Twitter.stop = function(){
  stream.stop();
};

Twitter.clear = function(cb){
  stream.stop();
  tweets.messages = [];
  cb(tweets.messages);
};

module.exports = Twitter;
