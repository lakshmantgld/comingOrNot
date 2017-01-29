### Directory structure
```
|──reactJS (front-end)
|  |──app
|  |  |──actions/
|  |  |──components/
|  |  |──reducers/
|  |  |──main.js
|  |──config
|  |  |──config.json
|  |──public
|  |  |──css/
|  |  |──fonts/
|  |  |──js/
|  |  |──favicon.ico
|  |──.babelrc
|  |──index.html
|  |──en.json
|  |──jp.json
|  |──package.json
|  |──server.js
|  |──webpack.config.js
|──serverless (back-end)
|  |──lib
|  |  |──dynamo.js
|  |  |──graphql.js
|  |  |──index.js
|  |  |──schema.js
|  |──config.json
|  |──handler.js
|  |──package.json
|  |──serverless.yml
|  |──webpack.config.js
|──gulpfile.js
|──package.json
|──yarn.lock
|──README.md
```
The **reactJS** directory contains all the reactJS and redux code forming the front-end part. The **app** directory in reactJS contains namely the component, action and reducer files. The **main.js** inside the **app** directory is the starting point of this react-redux app. To ease the development process, there is a webpack-dev-server and hot-reload features whose configuration is written in the **webpack.config.js** file. The **bundled main.js** file is finally added to **index.html**.

The **serverless** directory contains the serverless definition file, graphQL file and CRUD operations to database. The **serverless.yml** is the starting point of the back-end. It contains all the information about the endpoints, properties of lambda function and structure of NoSQL database. The **lib** directory contains the CRUD operations to be performed on the database and the graphQL schema.

## Installation & Usage

* Clone this repo.

* Make sure AWS credentials are setup properly. Otherwise refer [this document](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md)

* Install project dependencies. **cd ComingOrNot** and type,

```
 yarn install or npm install
```

* When you are ready to deploy your database and API to AWS, run following command.

```
 yarn run deploy or npm run deploy
```

* Once, the deployment is over, serverless will display all your **API endpoints**.

* Copy the baseURL of the API's and paste it in **reactJS/config/config.json** under the **api** property.

* Run the client now.

```
 yarn run app or npm run app
```

* Now, the react app powered by serverless will open in your browser.


## Deploying to Production

* For the production, the backend steps are the same. But, to minify the bundled react-redux app, you can run the following command in **reactJS** directory.

```
 webpack -p
```

* Upload the **index.html**, **bundled app.js**, and other static assets to AWS S3 or similar service. Now, you are done with it.
