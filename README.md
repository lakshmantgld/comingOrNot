ReactJS-Redux-Serverless-GraphQL event planner
============================

[![serverless](https://img.shields.io/badge/serverless-v1.5.1-yellow.svg)](http://www.serverless.com)
[![react](https://img.shields.io/badge/react-v15.4.2-blue.svg)](https://github.com/facebook/react)
[![redux](https://img.shields.io/badge/redux-v3.5.2-orange.svg)](http://redux.js.org/docs/introduction/)
[![graphQL](https://img.shields.io/badge/graphQL-v0.7.2-red.svg)](http://graphql.org/)

[ComingOrNot](http://comingornot.com)

<!-- This project is an attempt to resolve the problems encountered during scheduling of various events like meetups, office party, etc., -->

As the name suggests, It's an event planner app that strives to ease the work of an organizer, conduct events and get togethers in a much planned and less chaotic way. The steps are quite simple,

1. create an event
2. share the link to the participants
3. once the participants cast their entries, zero in on the best possible date.

This web app is powered by the serverless service offered by AWS's Lambda and NoSQL storage dynamoDB.

### Live web app:
[ComingOrNot](http://comingornot.com)

### Technical Architecture:
![Architecture diagram](https://raw.githubusercontent.com/lakshmantgld/LetsMeetUp/stable/readmeFiles/architecture.png)

### How it Looks in Mobile:
![UI](https://raw.githubusercontent.com/lakshmantgld/LetsMeetUp/stable/readmeFiles/HowToComingOrNot.png)

### Installation & Usage:
Refer [Installation & Usage](https://github.com/lakshmantgld/LetsMeetUp/blob/stable/readmeFiles/reproduce.md) readme for steps for reproducing and in-depth understanding on directory structure.

### Deployment:
- Add images using the FQDN.

#### AWS Deployment
1. Run `webpack -p` after editing the `webpack.config.js` file.
2. Log in to the AWS console, navigate to **S3** and upload the `dist/app.js` file to the appropriate directory. 


### Inspired from:
[Chouseisan](https://chouseisan.com/)
