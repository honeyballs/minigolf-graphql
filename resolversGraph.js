//Each GraphQL Field must be resolved via a resolver function

//Import custom scalars
import GraphQLLong from "graphql-type-long";
import UnixDate from "graphql-types-unix-timestamp";

//Import the neo4j driver
import { v1 as neo4j } from "neo4j-driver";

export default async function() {
  //Create a driver instance connected to localhost
  let driver = neo4j.driver(
    "bolt://127.0.0.1:7687",
    neo4j.auth.basic("neo4j", "passwort")
  );

  const resolver = {
    User: {
      club(user){
        //Neo4j Stuff
      }
    },
    Query: {
      //Define the resolver for the queries

      //Resolver to get all users
      users(_, params) {
        let session = driver.session();
        let query = "MATCH (user:User) RETURN user;";
        return session
          .run(query, params)
          .then(result => {
            return result.records.map(record => {
              //Integrate the id into the result
              let userData = record.get("user").properties
              let userId = record.get("user").identity
              let returnValue = { ...userData, id: userId }
              return returnValue;
            });
          })
          .catch(error => {
            console.error(error.stack);
          });
      }
    },
    LONG: GraphQLLong,
    TIMESTAMP: UnixDate
  };
  return resolver;
}
