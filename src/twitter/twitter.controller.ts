import * as express from 'express';
import TwitterManager from './twitter.manager';

class TwitterController {
  public path = '/';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(`${this.path}auth/twitter/callback`, this.authCallback);
    this.router.get(`${this.path}getUserDetails/:username`, this.getUserDetails);
    this.router.get(`${this.path}getFollwersList/:username`, this.getFollwersList);
  }
  public authCallback = async (request: express.Request, response: express.Response) => {
    return await new TwitterManager().requestToken(request, response);
  }
  public getUserDetails = async (request: express.Request, response: express.Response) => {
    return await new TwitterManager().getUserDetails(request, response);
  }
  public getFollwersList = async (request: express.Request, response: express.Response) => {
    return await new TwitterManager().getFollowersList(request, response);
  }
}

export default TwitterController;
