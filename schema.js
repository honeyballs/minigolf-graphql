//Import graphql-tools
import { makeExecutableSchema } from 'graphql-tools';

//Import resolvers
import resolvers from './resolversGraph';

//Movie Schema
const typeDefs = `
    type Movie {
        movieId: String!
        title: String
        year: Int
        plot: String
        poster: String
        imdbRating: Float
        genres: [String]
        similar: [Movie]
    }

    type Genre {
        name: String!
    }

    type Query {
        movies(subString: String!, limit: Int!): [Movie],
        genres(subString: String!): [Genre]
    }

    schema {
        query: Query
    }
`;

export default makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers
});