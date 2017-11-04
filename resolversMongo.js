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
  const Rounds = db.collection('round')
  const Holes = db.collection('hole')
  const Lines = db.collection('line')

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
        let result = (await User.find({}).toArray()).map(prepare)
        result = await Promise.all(result.map(async(i)=>{
          if(!i.friends) return i
          i.friends = (await Promise.all(i.friends.map(async f=>{
            let o = await User.findOne({_id: ObjectId(f)})
            return o
          }))).filter(i=>{return i!=null})
          return i
        }))
        return result
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
      rounds :async (_, params) => {
        return (await Rounds.find({}).toArray()).map(prepare)
      },
      holes :async (_, params) => {
        return (await Holes.find({}).toArray()).map(prepare)
      },
      lines :async (_, params) => {
        return (await Lines.find({}).toArray()).map(prepare)
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
      createClub: async(root, args, context, info) => {
        const res = await Clubs.insert(args)
        return (res && res.result && res.result.ok)
      },
      createRound: async(root, args, context, info) => {
        const res = await Rounds.insert(args)
        return (res && res.result && res.result.ok)
      },
      createHole: async(root, args, context, info) => {
        const res = await Holes.insert(args)
        return (res && res.result && res.result.ok)
      },
      addFriend: async(root, args, context, info) => {
        const res = await User.findOne({_id:ObjectId(args.id)})
        if(!res) return false;
        const link = await User.findOne({email: args.email})
        if(!link) return false;
        return User.updateOne({_id:ObjectId(args.id)}, {$push: {friends: link._id.toString()}})
      },
    },
    LONG: GraphQLLong,
    TIMESTAMP: UnixDate
  };

};
