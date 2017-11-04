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
        let params = {id: user.id}
        return resolveTypes(driver, params, "User", "IS_IN", "Club")
      },
      friends(user) {
        let params= {id: user.id}
        return resolveTypes(driver, params, "User", "IS_FRIEND", "User")
      }
    },
    Course: {
      type(course) {
        let params = {id: course.id}
        return resolveTypes(driver, params, "Course", "TYPE_OF", "Coursetype")
      },
      lines(course) {
        let params = {id: course.id}
        return resolveTypes(driver, params, "Course", "IN_COURSE", "Line")
      }
    },
    Round: {
      user(round) {
        let params = {id: round.id}
        return resolveTypes(driver, params, "Round", "PLAYED_BY", "User")
      },
      course(round) {
        let params = {id: round.id}
        return resolveTypes(driver, params, "Round", "PLAYED_ON", "Course")
      }
    },
    Hole: {
      round(hole) {
        let params = {id: hole.id}
        return resolveTypes(driver, params, "Hole", "PLAYED_IN", "Round")
      }
    },
    Line: {
      courses(line) {
        let params = {id: line.id}
        return resolveTypes(driver, params, "Line", "IN_COURSE", "Course")
      },
      type(line) {
        let params = {id: line.id}
        return resolveTypes(driver, params, "Line", "TYPE_OF", "Coursetype")
      }
    },
    Query: {
      //Define the resolver for the queries

      //Resolver to get all users
      users(_, params) {
        return getAllRecords(driver,params,"User")
      },
      clubs(_, params) {
        return getAllRecords(driver,params,"Club")
      },
      coursetypes(_, params) {
        return getAllRecords(driver,params,"Coursetype")
      },
      courses(_, params) {
        return getAllRecords(driver,params,"Course")
      },
      rounds(_, params) {
        return getAllRecords(driver,params,"Round")
      },
      holes(_, params) {
        return getAllRecords(driver,params,"Hole")
      },
      lines(_, params) {
        return getAllRecords(driver,params,"Line")
      },
      galleries(_, params) {
        return getAllRecords(driver,params,"Gallery")
      }
    },
    Mutation: {
      registerUser(_, params) {
        return setMutation(driver,params,`
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
          }) RETURN CASE WHEN user IS NULL THEN false ELSE true END`)
      },
      createCourseType(_, params) {
        return setMutation(driver,params,`
          CREATE (ct:Coursetype {
            type: $type
          }) RETURN CASE WHEN ct IS NULL THEN false ELSE true END`)
      },
      createCourse(_, params) {
        return setMutation(driver,params,`
          MATCH (ct:Coursetype) WHERE ID(ct) = $courseTypeId
          CREATE (course:Course {
            name: $name,
            breitengrad: $breitengrad,
            laengengrad: $laengengrad,
            info: $info
          })-[:TYPE_OF]->(ct) RETURN CASE WHEN course IS NULL THEN false ELSE true END`)
      },
      createClub(_, params) {
        return setMutation(driver,params,`
          MATCH (club:Club{
            name: $name
          }) RETURN CASE WHEN club IS NULL THEN false ELSE true END`)
      },
      createGallery(_, params) {
        return setMutation(driver,params,`
          CREATE (gallery:Gallery {
            image: $image,
            text: $text
          })
          RETURN CASE WHEN gallery IS NULL THEN false ELSE true END`)
      },
      createRound(_, params) {
        return setMutation(driver,params,`
          MATCH (u:User) WHERE ID(u) = $userId
          MATCH (c:Course) WHERE ID(c) = $courseId
          CREATE (round:Round {
            date: $date
          })-[:PLAYED_BY]->(u)
          CREATE (round)-[:PLAYED_ON]->(c)
          RETURN CASE WHEN round IS NULL THEN false ELSE true END`)
      },
      createHole(_, params) {
        return setMutation(driver,params,`
          MATCH (r:Round) WHERE ID(r) = $roundId
          CREATE (hole:Hole {
            hole: $hole,
            strokes: $strokes
          })-[:PLAYED_IN]->(r)
          RETURN CASE WHEN hole IS NULL THEN false ELSE true END`)
      },
      createLine(_, params) {
        return setMutation(driver,params,`
          MATCH (ct:Coursetype) WHERE ID(ct) = $courseTypeId
          CREATE (line:Line {
            name: $name,
            info: $info
          })-[:TYPE_OF]->(ct)
          RETURN CASE WHEN line IS NULL THEN false ELSE true END`)
      },
      addFriend(_, params) {
        return setMutation(driver,params,`
          MATCH (u:User) WHERE ID(u) = $id
          MATCH (friend:User {email: $email})
          CREATE (u)-[:IS_FRIEND]->(friend)`)
      },
      addLineForCourse(_, params) {
        return setMutation(driver,params,`
          MATCH (c:Course) WHERE ID(c) = $courseId
          MATCH (l:Line) WHERE ID(l) = $lineId
          CREATE (c)-[:IN_COURSE]->(l)`)
      },
      // does delete always return null?
      deleteRound(_,params) {
        return setMutation(driver,params,`
          MATCH (round:Round)-[:PLAYED_BY]->(u:User) WHERE ID(round) = $roundId AND ID(u) = $userId
          DETACH DELETE round
          RETURN CASE WHEN round IS NULL THEN false ELSE true END`)
      },
      deleteLineFromCourse(_,params) {
        return setMutation(driver,params,`
          MATCH (c:Course)-[relation:IN_COURSE]->(l:Line) WHERE ID(c) = $courseId AND ID(l) = $lineId
          DETACH DELETE relation
          RETURN CASE WHEN relation IS NULL THEN false ELSE true END`)
      }
    },
    LONG: GraphQLLong,
    TIMESTAMP: UnixDate
  };
  return resolver;
}

function addRecordID(records,typeName) {
  return records.map(record => {
    console.log({ ...record.get(typeName).properties, id: record.get(typeName).identity})        
    //Integrate the id into the result
    return { ...record.get(typeName).properties, id: record.get(typeName).identity};
  });
}

function getAllRecords(driver,params,typeName) {
    let session = driver.session();
    let query = `MATCH (name:${typeName}) RETURN name;`;
    return session
      .run(query, params)
      .then(result => {
        session.close()
        return addRecordID(result.records,"name");
      })
      .catch(error => {
        console.log(error.stack);
      });
}

function resolveTypes(driver, params, parentType, relationName, childType) {
    let session = driver.session()
    let query = `
      MATCH (n:${parentType})-[:${relationName}]-(m:${childType}) WHERE ID(n) = $id RETURN m
    `
    return session.run(query, params).then( result => {
      return result.records.map( record => {
        let returnObj = {...record.get("m").properties, id: record.get("m").identity}
        session.close()
        return returnObj;
      })
    }).catch( error => {
      console.log(error.stack)
    })
}

function setMutation(driver,params,query) {
    let session = driver.session();
    // if (typeName !="") query += ` RETURN CASE WHEN `+typeName+` IS NULL THEN false ELSE true END`
    return session.run(query, params).then( result => {
      return result.records.map( record => {
        session.close()
        return record;
      })
    }).catch( error => {
      console.log(error.stack)
    })
}