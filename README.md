## ReactJS-Redux-Serverless web app
This project is an attempt to resolve the problems encountered during scheduling of various events like meetups, office party, etc.,

This web app is powered by the serverless service offered by microsoft's azure functions and NoSQL storage documentDB.

### Local development
Since, the **serverless framework** is yet to introduce azure and lot of serverless part has to be done in the browser, we are using nodeJS and mongoDB for local development.

##### Instructions to reproduce the project in local:
- Start a mongo server and fill the credentials of mongo server in **config/config.json**.
- Install **nodeJS and npm**.
- Install all npm packages using **npm install**.
- To bundle reactJS, we use **webpack**. So, run webpack at the start. To perform asynchronous bundling, use the below command:

```
node_modules/.bin/webpack/ -d --watch
```
- Run the node server using **node bin/www**

### Steps to use back-end in azure.
- Create a account in azure using **portal.azure.com**.
- Choose **Function App** under **Compute resources**.
- Give all the necessary details for creating the function app. Choose **dynamic plan** which is **pay-per-execution** model.
- Perform the below steps for all CRUD functions of the app.
- Select **webhook + API** and **javascript** language as shown below:

![LetsMeetUp](https://raw.githubusercontent.com/Lakshman-LD/LetsMeetUp/master/readmeImages/firstStep.png)
- Insert the code from **serverless/** directory into the Code area and note down the function **URL** as shown below.

![LetsMeetUp](https://raw.githubusercontent.com/Lakshman-LD/LetsMeetUp/master/readmeImages/SecondStep.png)
- Perform bindings with documentDB under **Integrate section** in the browser as shown below.

![LetsMeetUp](https://raw.githubusercontent.com/Lakshman-LD/LetsMeetUp/master/readmeImages/ThirdStep.png)
- Under local, the web app will be powered by nodeJS. For making it serverless, change the restful API's in **actions/registerActions.js** file.
- Performing the above will give a serverless app.

### Tasks for Stable release:
 - [x] Include weather Information
 - [x] Cookie based Updating
 - [x] Mobile UI in eventPage
 - [ ] Mobile UI in eventRegistrationPage
 - [ ] Location
 - [ ] Restaurant Selection
 - [ ] Train Information based on Location

### Live web app:
[LetsMeetUp](http://letsmeetupp.azurewebsites.net)

### Inspired from:
[Chouseisan](https://chouseisan.com/)
