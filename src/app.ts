const passport = require('passport');
import * as bodyParser from 'body-parser';
const cors = require('cors');
import * as express from 'express';
import { passportAuth } from './passport';
import TwitterManager from './twitter/twitter.manager';
passportAuth();
class App {
  public app: express.Application;
  public port: number;
  public twitterManager = new TwitterManager();

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/api', controller.router);
    });
    this.app.post('/api/auth/twitter',this.twitterManager.oauthVerifier,
                  passport.authenticate('twitter-token', { session: false }), this.twitterManager.setApiToken,
                  this.twitterManager.generateToken, this.twitterManager.sendToken);
  }
}

export default App;
