//Each GraphQL Field must be resolved via a resolver function

//Import custom scalars
import GraphQLLong from 'graphql-type-long';

//Import the neo4j driver
import { v1 as neo4j } from "neo4j-driver";

//Create a driver instance connected to localhost
let driver = neo4j.driver(
  "bolt://127.0.0.1:7687",
  neo4j.auth.basic("neo4j", "passwort")
);

const resolveFunctions = {
  Long: GraphQLLong,
  Query: {
    //Define the resolver for the queries
    
    //Resolver to get all users
    users() {
      let session = driver.session();
      let query =
        "MATCH (user:User) RETURN user;";
      return session.run(query, params).then(result => {
        return result.records.map(record => {
          return record.get("user").properties;
        });
      });
    }
  }
};

export default resolveFunctions;
