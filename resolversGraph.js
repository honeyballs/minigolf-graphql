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
              session.close()
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
      },
      clubs(_, params) {
        let session = driver.session();
        let query = "MATCH (club:Club) RETURN club;";
        return session
          .run(query, params)
          .then(result => {
            return result.records.map(record => {
              session.close()
              //Integrate the id into the result
              let clubData = record.get("club").properties
              let clubId = record.get("club").identity
              let returnValue = { ...clubData, id: clubId }
              return returnValue;
            });
          })
          .catch(error => {
            console.error(error.stack);
          });
      },
      coursetypes(_, params) {
        let session = driver.session();
        let query = "MATCH (ct:Coursetype) RETURN ct;";
        return session
          .run(query, params)
          .then(result => {
            return result.records.map(record => {
              session.close()
              //Integrate the id into the result
              let ctData = record.get("ct").properties
              let ctId = record.get("ct").identity
              let returnValue = { ...ctData, id: ctId }
              return returnValue;
            });
          })
          .catch(error => {
            console.error(error.stack);
          });
      }
    },
    Mutation: {
      registerUser(_, params) {
        let session = driver.session()
        let query = `
          CREATE (user:User {
            name: $name, 
            email: $email, 
            passwordHash: $passwordHash,
            role: 1,
            gender: 'm',
            registration: TIMESTAMP(),
            active: 1,
            logins: 0,
            birthday: 373030177000,
            regKey: 'regkey??'
          }) RETURN CASE WHEN user IS NULL THEN false ELSE true END
        `
        return session.run(query, params).then( result => {
          return result.records.map( record => {
            session.close()
            return record;
          })
        }).catch( error => {
          console.error(error.stack)
        })
      },
      createCourseType(_, params) {
        let session = driver.session()
        let query = `
          CREATE (ct:Coursetype {
            type: $type
          }) RETURN CASE WHEN ct IS NULL THEN false ELSE true END
        `
        return session.run(query, params).then( result => {
          return result.records.map( record => {
            session.close()
            return record;
          })
        }).catch( error => {
          console.error(error.stack)
        })
      },
      createCourse(_, params) {
        let session = driver.session()
        let query = `
          MATCH (ct:Coursetype) WHERE ID(ct) = $courseTypeId
          CREATE (course:Course {
            name: $name,
            breitengrad: $breitengrad,
            laengengrad: $laengengrad,
            info: $info
          })-[:TYPE_OF]->(ct) RETURN CASE WHEN course IS NULL THEN false ELSE true END
        `
        return session.run(query, params).then( result => {
          return result.records.map( record => {
            session.close()
            return record;
          })
        }).catch( error => {
          console.error(error.stack)
        })
      }
    },
    LONG: GraphQLLong,
    TIMESTAMP: UnixDate
  };
  return resolver;
}
