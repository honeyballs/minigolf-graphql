//Each GraphQL Field must be resolved via a resolver function

//Import the neo4j driver
import { v1 as neo4j } from "neo4j-driver";

//Create a driver instance connected to localhost
let driver = neo4j.driver(
  "bolt://127.0.0.1:7687",
  neo4j.auth.basic("neo4j", "passwort")
);

const resolveFunctions = {
  Query: {
    //Define the resolver for the queries
    //params contains the values for substring and limit parameters
    
  }
};

export default resolveFunctions;
