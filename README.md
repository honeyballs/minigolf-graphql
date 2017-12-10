# README

## Prerequisites

First install Node.js and at least one of the following database clients:

* [Node.js](https://nodejs.org/en/)
* [Neo4j](https://neo4j.com/download/)
* [MongoDB](https://www.mongodb.com/download-center)

## Set up the server

Make sure one of the database clients is running. You can find the databases inside the databases folder. 

For Neo4j just start the installed client, choose the database location in the client window and hit start. The credentials for the test database are `neo4j:passwort`.

//Mongo setup

Open the command line tool inside the project folder.  Now run

```npm install```

This will install all the dependencies required to run the server. Afterwards start the server with

```npm start```

To switch the resolver you want to use just open `schema.js` and change the comments preceding the resolver import at the top of the file.

## Test the server

To access the graphical interface of the server go to <localhost:8080/graphiql> 

To learn more about GraphQL queries and mutations visit the [GraphQL docs](http://graphql.org/learn/queries/). 



