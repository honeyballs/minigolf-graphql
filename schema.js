//Import graphql-tools
import { makeExecutableSchema } from 'graphql-tools';

//Import resolvers
import getResolvers from './resolversMongo';
//import getResolvers from './resolversGraph';

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
        club: [Club]
        friends: [User]
        rounds: [Round]
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
        type: [Coursetype]
        rounds: [Round]
    }

    type Coursetype {
        id: ID!
        type: String
    }

    type Round {
        id: ID!
        date: LONG
        name: String
        user: [User]
        course: [Course]
    }

    type Hole {
        id: ID!
        hole: Int
        strokes: Int
        round: [Round]
    }

    type Line {
        id: ID!
        name: String
        info: String
        #courses: [Course]
        type: [Coursetype]
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
        clubs: [Club]
        courses: [Course]
        
        coursetypes: [Coursetype]
        rounds: [Round]
        holes: [Hole]
        lines: [Line]
        galleries: [Gallery]

        # Queries with parameters
        getCourse(courseId: String!): [Course]
        
        #Unused Queries - Defined but not implemented
        #areFriends(userId: String!, friendId: String!) [User]
        #getCourseScores(courseId: String!): [Course]
        #getCourseByUser(userId: String!): [Course]
        #getUserByLogin(email: String!, passwordHash: String!): [User]
        #getUserById(userId: String!): [User]
        #getRoundsForUser(userId: String!): [Round]
        #getCourseUserScores(courseId: Int!, userId: Int!): [date, username, courseId]
        #getHoles(roundId: String!): [Hole]

        
        # queryname(parameter1: String!, parameter2: Int!): [User]
    }

    # Define CRUD operations
    type Mutation {
        # Inserts, generate ids in resolver/via auto_increment
        createRound(userId: String!, courseId: String!, date: LONG!): Boolean
        createHole(roundId: String!, hole: Int!, strokes: Int): Boolean
        registerUser(email: String!, name: String!, passwordHash: String!): Boolean
        # zu user automatisch: id generieren, regkey, logins auf 0 setzen, registration timestamp, beziehung zu club bzw. club id
        createGallery(image: String!, text: String!): Boolean
        createCourse(name: String!, breitengrad: Float, laengengrad: Float, info: String, courseTypeId: String!): Boolean
        createCourseType(type: String!): Boolean
        createClub(name: String!): Boolean

        createLine(name: String!, info: String!, courseTypeId: String!): Boolean

        # Connect tables
        addFriend(id: String!, email: String!): Boolean
        addLineForCourse(courseId: String!, position: String!, lineId: String!): Boolean

        # Update
        # setLine ändert den Typ der Bahn
        setLine(courseId: String!, position: Int!, lineId: String!): Boolean # Beziehung setzen zwischen courses und lines

        # Delete
        deleteRound(roundId: String!, userId: String!): Boolean
        deleteLineFromCourse(lineId: String!, courseId: String!): Boolean
    }

    schema {
        query: Query
        mutation: Mutation
    }
`;

export default async () => {
    let resolvers = await getResolvers()
    return makeExecutableSchema({
        typeDefs: typeDefs,
        resolvers
    });
}
