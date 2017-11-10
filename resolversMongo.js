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
  const Coursetype = db.collection('coursetype')
  const Course = db.collection('course')
  const Rounds = db.collection('round')
  const Holes = db.collection('hole')
  const Lines = db.collection('line')
  const Galleries = db.collection('gallery')

  //trasnform _id from  an ObjectId into a string
  const prepare = (o) =>{
    o._id = o._id.toString()
    return o
  }

  const getArrayRelation = async (src, target) => {
    if(!src) return null
    let obj_ids = src.map(id=>ObjectId(id))
    let r = (await target.find({_id: {$in: obj_ids}}).toArray()).map(prepare)
    return r
  }

  const getSingleRelation = async (src, target) => {
    if(!src) return null
    let r = (await target.findOne({_id: ObjectId(src)}))
    return [r]
  }

  return {
    User: {
      friends:async(user) => {
        return getArrayRelation(user.friends, User)
      },
      club:async(user) => {
        return getSingleRelation(user.clubs, Clubs)
      },
    },
    Course: {
       type(course) {
         return getSingleRelation(course.type, Coursetype)
       },
      lines(course) {
        return getArrayRelation(course.lines, Lines)
      }
    },
    Round: {
      user(round) {
        return getSingleRelation(round.user, User)
      },
      course(round) {
        return getSingleRelation(round.course, Course)
      }
    },
    Hole: {
      round(hole) {
        return getSingleRelation(hole.round, Rounds)
      }
    },
    Line: {
      courses(line) {
        return getArrayRelation(line.courses, Course)
      },
      type(line) {
        return getSingleRelation(line.type, Coursetype)
      }
    },
    Query: {
      //Define the resolver for the queries

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
      rounds :async (_, params) => {
        return (await Rounds.find({}).toArray()).map(prepare)
      },
      holes :async (_, params) => {
        return (await Holes.find({}).toArray()).map(prepare)
      },
      lines :async (_, params) => {
        return (await Lines.find({}).toArray()).map(prepare)
      },
      galleries :async (_, params) => {
        return (await Galleries.find({}).toArray()).map(prepare)
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
        args.type = args.courseTypeId
        args.courseTypeId = undefined
        const res = await Course.insert(args)
        return (res && res.result && res.result.ok)
      },
      createClub: async(root, args, context, info) => {
        const res = await Clubs.insert(args)
        return (res && res.result && res.result.ok)
      },
      createGallery: async(root, args, context, info) => {
        const res = await Galleries.insert(args)
        return (res && res.result && res.result.ok)
      },
      createRound: async(root, args, context, info) => {
        args.user = args.userId
        args.userId = undefined
        args.course = args.courseId
        args.courseId = undefined
        const res = await Rounds.insert(args)
        return (res && res.result && res.result.ok)
      },
      createHole: async(root, args, context, info) => {
        args.round = args.roundId
        args.roundId = undefined
        const res = await Holes.insert(args)
        return (res && res.result && res.result.ok)
      },
      createLine: async(root, args, context, info) => {
        args.type = args.courseTypeId
        args.courseTypeId = undefined
        const res = await Lines.insert(args)
        return (res && res.result && res.result.ok)
      },
      addFriend: async(root, args, context, info) => {
        const link = await User.findOne({email: args.email})
        if(!link) return false;
        const res = await User.updateOne({_id:ObjectId(args.id)}, {$push: {friends: link._id.toString()}})
        return (res && res.result && res.result.ok && res.result.n)
      },
      addLineForCourse: async(root, args, context, info) => {
        const link = await Lines.findOne({_id: ObjectId(args.lineId)})
        if(!link) return false;
        const res = await Course.updateOne({_id:ObjectId(args.courseId)}, {$push: {lines: link._id.toString()}})
        return (res && res.result && res.result.ok && res.result.n)
      },
      deleteRound: async(root, args, context, info) => {
        let r = await Rounds.remove({_id: ObjectId(args.roundId)})
        if(!r || !r.result || !r.result.n) return false
        //delete relations
        let rel = await Holes.remove({round: args.roundId})
        return true
      },
      deleteLineFromCourse: async(root, args, context, info) => {
        const res = await Course.updateOne({_id:ObjectId(args.courseId)}, {$pull: {lines: args.lineId}})
        return (res && res.result && res.result.ok && res.result.n)
      },
    },
    LONG: GraphQLLong,
    TIMESTAMP: UnixDate
  };

};
