# book exchange project
A book exchange application with client and server side code

### app is about
User registration, book posting and changing

### app features
* user registration, user login
* client and server user validation - client with vuetify, server with Joi and mongoose
* password crypting
* jwt webtoken authentication
* auto login
* saving documents to MongDb, creating Schema and modell with mongoose
* client side request and server side pagination in the db
* client side route guards
* vuex state management
* lazy loading user pages

### front-end
* Vue.js
* Vuetify
* Material design

### back-end
* Node.js
* Express.js
* MongoDB

### to run the app
* need to configure the database - it can be a remote or a local, but you have to configure it
```
"./server/config/config.js"
```

* need to have vue-cli
[vue.js](https://vuejs.org/)


#### you need to run two server
the client which is bundle the Vue dev build together - and the node server

* spin up the server
```
cd server
```
```
node server.js
```

* bundle and host the Vue app
```
cd client
```
```
npm run serve
```