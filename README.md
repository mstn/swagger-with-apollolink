**Update:** we now have a package [apollo-link-swagger](https://www.npmjs.com/package/apollo-link-swagger)!

This demo is an attempt to build a GraphQL wrapper for RESTful API **working only on the client side**.

Quick start
* clone the project
* npm i
* npm start

We assume that RESTful endpoints have a formal specification. In this demo we use Swagger 2.0.

* SwaggerSchema is uploaded on the fly over the network.
* SwaggerSchema is translated into GraphQLSchema.
* ApolloClient is initialized with a SchemaLink fed with the generated GraphQLSchema.
* ApolloDevTools can be used to explore the schema on the browser.
* If you open Chrome Network tab, you can see how GraphQL queries are translated into HTTP requests.

Under the hood, we use [swagger-to-graphql](https://github.com/yarax/swagger-to-graphql) for generating GraphQLSchemas from Swagger specifications.

We use [Swagger PetStore](http://petstore.swagger.io/) schema and server.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
