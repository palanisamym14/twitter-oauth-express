import { twitterConfig } from './config/config';

// tslint:disable-next-line:one-variable-per-declaration
const passport = require('passport');
// tslint:disable-next-line:variable-name
const TwitterTokenStrategy = require('passport-twitter-token');

export const passportAuth = () => {

  passport.use(new TwitterTokenStrategy({
    consumerKey: twitterConfig.consumerKey,
    consumerSecret: twitterConfig.consumerSecret,
    includeEmail: true,
  },                                    (token, tokenSecret, profile, cb) => {
    return cb(null, profile);
  }));

};
