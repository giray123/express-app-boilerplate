# Express App Boilerplate
This is a basic Node-Express boilerplate to create a web app quickly with authentication. The web app can render pages and expose a REST-ish API. It has both email&password and social logins with passport.js

### Authentication
The app uses both normal email & password login and social logins (Facebook, Twitter and Google). All login types uses in-house token based authentication system. There are short-lived access tokens and long-lived (without expiration) refresh tokens.

## Install

```sh
$ git clone git://github.com/giray123/express-app-boilerplate
$ cd express-app-boilerplate
$ npm install
$ npm run dev
```