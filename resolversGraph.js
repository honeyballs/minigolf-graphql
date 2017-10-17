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
    //Define the resolver for the movies query which looks for movies by title
    //params contains the values for substring and limit parameters
    movies(_, params) {
      //query Neo4J
      let session = driver.session();
      let query =
        "MATCH (movie:Movie) WHERE movie.title CONTAINS $subString RETURN movie LIMIT $limit;";
      return session.run(query, params).then(result => {
        return result.records.map(record => {
          return record.get("movie").properties;
        });
      });
    },
    genres(_,params) {
      let session = driver.session();
      let query = "MATCH (genre:Genre) WHERE genre.name CONTAINS $subString RETURN genre;";
      return session.run(query, params).then(result => {
        return result.records.map( record => {
          return record.get("genre").properties;
        })
      })
    }
  },
  Movie: {
    //Get similar movies by genre
    similar(movie) {
      let session = driver.session(),
        params = { movieId: movie.movieId },
        query = `
                MATCH (m:Movie) WHERE m.movieId = $movieId
                MATCH (m)-[:IN_GENRE]->(g:Genre)<-[:IN_GENRE]-(movie:Movie)
                WITH movie, COUNT(*) AS score
                RETURN movie ORDER BY score DESC LIMIT 3
            `;
      return session.run(query, params).then(result => {
        return result.records.map(record => {
          return record.get("movie").properties;
        });
      });
    },
    genres(movie) {
      //Genres are defined by relationships
      let session = driver.session(),
        params = { movieId: movie.movieId },
        query = `
                MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)
                WHERE m.movieId = $movieId
                RETURN g.name AS genre
            `;
      return session.run(query, params).then(result => {
        return result.records.map(record => {
          return record.get("genre");
        });
      });
    }
  }
};

export default resolveFunctions;
