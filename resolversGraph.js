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
        return getAllRecords(driver,params,"User")
          .then(result => {
            return result})
          .catch(error => {
            console.log(error.stack);
          });
      },
      clubs(_, params) {
        return getAllRecords(driver,params,"Club")
          .then(result => {
            return result})
          .catch(error => {
            console.log(error.stack);
          });
      },
      coursetypes(_, params) {
        return getAllRecords(driver,params,"Coursetype")
          .then(result => {
            return result})
          .catch(error => {
            console.log(error.stack);
          });
      },
      courses(_, params) {
        return getAllRecords(driver,params,"Course")
          .then(result => {
            return result})
          .catch(error => {
            console.log(error.stack);
          });
      },
      rounds(_, params) {
        return getAllRecords(driver,params,"Round")
          .then(result => {
            return result})
          .catch(error => {
            console.log(error.stack);
          });
      },
      holes(_, params) {
        return getAllRecords(driver,params,"Hole")
          .then(result => {
            return result})
          .catch(error => {
            console.log(error.stack);
          });
      },
      lines(_, params) {
        return getAllRecords(driver,params,"Line")
          .then(result => {
            return result})
          .catch(error => {
            console.log(error.stack);
          });
      },
      galleries(_, params) {
        return getAllRecords(driver,params,"Gallery")
          .then(result => {
            return result})
          .catch(error => {
            console.log(error.stack);
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
      },
      // createClub ??
      createGallery(_, params) {
        return setMutation(driver,params,"gallery",
          ` CREATE (gallery:Gallery {
              image: $image,
              text: $text
            })`)
          .then(result => { return result })
          .catch(error => { console.log(error.stack) })
      },
      createRound(_, params) {
        return setMutation(driver,params,"round",`
          MATCH (u:User) WHERE ID(u) = $userId
          MATCH (c:Course) WHERE ID(c) = $courseId
          CREATE (round:Round {
            date: $date
          })-[:PLAYED_BY]->(u)
          CREATE (round)-[:PLAYED_ON]->(c)`)
          .then(result => { return result })
          .catch(error => { console.log(error.stack) })
      },
      createHole(_, params) {
        return setMutation(driver,params,"hole",`
          MATCH (r:Round) WHERE ID(r) = $roundId
          CREATE (hole:Hole {
            hole: $hole,
            strokes: $strokes
          })-[:PLAYED_IN]->(r)`)
          .then(result => { return result })
          .catch(error => { console.log(error.stack) })
      },
      createLine(_, params) {
        return setMutation(driver,params,"line",`
          MATCH (ct:Coursetype) WHERE ID(ct) = $courseTypeId
          CREATE (line:Line {
            name: $name,
            info: $info
          })-[:TYPE_OF]->(ct)`)
          .then(result => { return result })
          .catch(error => { console.log(error.stack) })
      },
      addFriend(_, params) {
        return setMutation(driver,params,"",`
          MATCH (u:User) WHERE ID(u) = $id
          MATCH (friend:User {email: $email})
          CREATE (u)-[:IS_FRIEND]->(friend)`)
          .then(result => { return result })
          .catch(error => { console.log(error.stack) })
      },
      addLineForCourse(_, params) {
        return setMutation(driver,params,"",`
          MATCH (c:Course) WHERE ID(c) = $courseId
          MATCH (l:Line) WHERE ID(l) = $lineId
          CREATE (c)-[:IN_COURSE]->(l)`)
          .then(result => { return result })
          .catch(error => { console.log(error.stack) })
      },
      // does delete always return null?
      deleteRound(_,params) {
        return setMutation(driver,params,"round",`
          MATCH (round:Round)-[:PLAYED_BY]->(u:User) WHERE ID(round) = $roundId AND ID(u) = $userId
          DETACH DELETE round`)
          .then(result => { return result })
          .catch(error => { console.log(error.stack) })
      },
      deleteLineFromCourse(_,params) {
        return setMutation(driver,params,"relation",`
          MATCH (c:Course)-[relation:IN_COURSE]->(l:Line) WHERE ID(c) = $courseId AND ID(l) = $lineId
          DETACH DELETE relation`)
          .then(result => { return result })
          .catch(error => { console.log(error.stack) })
      }
    },
    LONG: GraphQLLong,
    TIMESTAMP: UnixDate
  };
  return resolver;
}

function addRecordID(records,typeName) {
  return records.map(record => {          
    //Integrate the id into the result
    return { ...record.get(typeName).properties, id: record.get(typeName).identity};
  });
}

function getAllRecords(driver,params,typeName) {
  try{
    let session = driver.session();
    let query = "MATCH (name:"+typeName+") RETURN name;";
    return session
      .run(query, params)
      .then(result => {
        session.close()
        return addRecordID(result.records,"name");
      })
      .catch(error => {
        throw error;
      });
  }catch (e){
    // console.log(error.stack);
  }
}

function setMutation(driver,params,typeName,query) {
  try{
    let session = driver.session();
    if (typeName !="") query += ` RETURN CASE WHEN `+typeName+` IS NULL THEN false ELSE true END`
    return session.run(query, params).then( result => {
      return result.records.map( record => {
        session.close()
        return record;
      })
    }).catch( error => {
      throw error;
    })
  }catch (e){
    console.log(error.stack);
  }
}