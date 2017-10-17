//Import graphql-tools
import { makeExecutableSchema } from 'graphql-tools';

//Import resolvers
import resolvers from './resolversGraph';

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
    scalar LONG
    scalar TIMESTAMP

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
        club_id: Int
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
        type: Int
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
        user_id: Int
        name: String
        course_id: Int
        user: User
        course: Course
    }

    type Hole {
        id: ID!
        round_id: Int
        hole: Int
        strokes: Int
        round: Round
    }    

    type Line {
        id: ID!
        name: String
        type: Int
        info: String
        courses: [Course]
    }

    type Gallery {
        id: ID!
        image: String
        text: String
    }

    type ResultsPairs {
        id: ID!
        name: String
        tries: Int
        time: Int
        timestamp: TIMESTAMP
    }

    type Query {
        users: [User]
    }

    schema {
        query: Query
    }
`;

export default makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers
});