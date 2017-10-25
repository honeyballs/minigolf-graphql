//Each GraphQL Field must be resolved via a resolver function

//Import custom scalars
import GraphQLLong from 'graphql-type-long';
import UnixDate from 'graphql-types-unix-timestamp';

import {MongoClient, ObjectId} from 'mongodb'




export default async()=>{
  const MONGO_URL = 'mongodb://localhost:27017/minigolf'


  const db = await MongoClient.connect(MONGO_URL)
  const User = db.collection('user')

  return {
    Query: {
      //Define the resolver for the queries

      //Resolver to get all users
      users:async (_, params) => {
        return (await User.find({}).toArray()).map((o) => {
          o._id = o._id.toString()
          return o
        })

      }
    },
    LONG: GraphQLLong,
    TIMESTAMP: UnixDate
  };

};
