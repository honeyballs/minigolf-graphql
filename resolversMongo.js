//Each GraphQL Field must be resolved via a resolver function

//Import custom scalars
import GraphQLLong from 'graphql-type-long';
import UnixDate from 'graphql-types-unix-timestamp';

import {MongoClient, ObjectId} from 'mongodb'




export default async()=>{
  const MONGO_URL = 'mongodb://localhost:27017/minigolf'


  const db = await MongoClient.connect(MONGO_URL)
  const User = db.collection('user')
  const Clubs = db.collection('clubs')
  const Coursetype = db.collection('cousetype')
  const Course = db.collection('course')

  //trasnform _id from  an ObjectId into a string
  const prepare = (o) =>{
    o._id = o._id.toString()
    return o
  }

  return {
    Query: {
      //Define the resolver for the queries

      //Resolver to get all users
      users:async (_, params) => {
        return (await User.find({}).toArray()).map(prepare)
      },
      clubs:async (_, params) => {
        return (await Clubs.find({}).toArray()).map(prepare)
      },
      coursetypes:async (_, params) => {
        return (await Coursetype.find({}).toArray()).map(prepare)
      },
      courses :async (_, params) => {
        return (await Course.find({}).toArray()).map(prepare)
      },
    },
    Mutation: {
      registerUser: async (root, args, context, info) => {
        let modArgs = {...args, role:1, gender: 'm',
          registration: (new Date()).getTime(), active: 1, logins: 0, birthday: 373030177000}
        const res = await User.insert(modArgs)
        return (res && res.result && res.result.ok)
      },
      createCourseType: async(root, args, context, info) => {
        const res = await Coursetype.insert(args)
        return (res && res.result && res.result.ok)
      },
      createCourse: async(root, args, context, info) => {
        const res = await Course.insert(args)
        args.course = args.courseTypeId
        args.courseTypeId = undefined
        return (res && res.result && res.result.ok)
      },
    },
    LONG: GraphQLLong,
    TIMESTAMP: UnixDate
  };

};
