//Import graphql-tools
import { makeExecutableSchema } from 'graphql-tools';

//Import resolvers
//import resolvers from './resolversGraph';
import getResolvers from './resolversMongo';




//Example schema
/*
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

    type Query {
        movies(subString: String!, limit: Int!): [Movie],
        genres(subString: String!): [Genre]
    }

    type Mutation {
        createStuff(parameter: String!): [ReturnType]
    }

    schema {
        query: Query
    }
`;*/

const typeDefs = `
    # Define custom types
    scalar LONG
    scalar TIMESTAMP

    # Define tables
    type User {
        id: ID!
        name: String
        email: String
        passwordHash: String
        birthday: LONG
        gender: String
        regKey: String
        active: Int
        role: Int
        logins: Int
        registration: TIMESTAMP
        club: Club
        friends: [User]
    }

    type Club {
        id: ID!
        name: String
    }

    type Course {
        id: ID!
        name: String
        Breitengrad: Float
        Laengengrad: Float
        PLZ: Int
        Strasse: String
        Hausnummer: String
        Stadt: String
        info: String
        lines: [Line]
        type: Coursetype
    }

    type Coursetype {
        id: ID!
        type: String
    }

    type Round {
        id: ID!
        date: LONG
        name: String
        user: User
        course: Course
    }

    type Hole {
        id: ID!
        hole: Int
        strokes: Int
        round: Round
    }

    type Line {
        id: ID!
        name: String
        info: String
        courses: [Course]
        type: Coursetype
    }

    type Gallery {
        id: ID!
        image: String
        text: String
    }


    # Define select queries
    type Query {
        # Queries without parameters
        users: [User]

        # Queries with parameters
        # queryname(parameter1: String!, parameter2: Int!): [User]
    }

    # Define CRUD operations
    # type Mutations {
        # exactly like queries
    # }

    schema {
        query: Query
    }
`;







export default async ()=>{
  let resolvers = await getResolvers()
  return makeExecutableSchema({
      typeDefs: typeDefs,
      resolvers
  });
}
