import App from './app';
import TwitterController from './twitter/twitter.controller';

const app = new App(
  [
    new TwitterController(),
  ],
  4000,
);

app.listen();
