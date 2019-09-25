import { bodyParse } from 'helper/common.helper';
import { twitterConfig } from './../config/config';
import { urlConstant } from './../constants/url.constants';

// tslint:disable-next-line:one-variable-per-declaration
const request = require('request-promise'),
  jwt = require('jsonwebtoken');

class TwitterManager {

  public  setApiToken = async (req, res, next) => {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }
    req.auth = {
      id: req.user.id,
    };
    return next();
  }

  public oauthVerifier = async (req, res, next) => {
    try {
      const body = await request.post({
        url: urlConstant.OAUTH_VERIFIER,
        oauth: {
          consumer_key: twitterConfig.consumerKey,
          consumer_secret: twitterConfig.consumerSecret,
          token: req.query.oauth_token,
        },
        form: { oauth_verifier: req.query.oauth_verifier },
      });
      const parsedBody = JSON.parse(bodyParse(body));
      req.body.oauth_token = parsedBody.oauth_token;
      req.body.oauth_token_secret = parsedBody.oauth_token_secret;
      req.body.user_id = parsedBody.user_id;
      next();
    } catch (err) {
      return res.send(500, { message: err.message });
    }
  }

  public requestToken = async (req, res) => {
    try {
      const body = await request.post({
        url: urlConstant.REQUEST_TOKEN,
        oauth: {
          consumer_key: twitterConfig.consumerKey,
          consumer_secret: twitterConfig.consumerSecret,
          oauth_callback: urlConstant.TWITTER_CALLBACK,
        },
      });
      res.send(JSON.parse(bodyParse(body)));
    } catch (err) {
      return res.send(500, { message: err.message });
    }
  }

  public getUserDetails = async (req, res) => {
    try {
      const body = await request.get({
        url: `${urlConstant.USERS_SCREEN_NAME}${req.params.username}`,
        oauth: {
          consumer_key: twitterConfig.consumerKey,
          consumer_secret: twitterConfig.consumerSecret,
        },

      });
      res.send(JSON.parse(body));
    } catch (err) {
      return res.send(500, { message: err.message });
    }
  }

  public getFollowersList = async (req, res) => {
    try {
      const body = await request.get({
        url:  `${urlConstant.USERS_FOLLOWERS_NAME}${req.params.username}`,
        oauth: {
          consumer_key: twitterConfig.consumerKey,
          consumer_secret: twitterConfig.consumerSecret,
        },
      });
      res.send(JSON.parse(body));
    } catch (err) {
      return res.send(500, { message: err.message });
    }
  }

  public createToken = (auth) => {
    return jwt.sign({
      id: auth.id,
    }, 'react-oauth', {
      expiresIn: 60 * 120,
    });
  }

  public generateToken = (req, res, next) => {
    req.token = this.createToken(req.auth);
    return next();
  };

  public sendToken = (req, res) => {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
  }
}
export default TwitterManager;
