import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';

import getSchema from './schema';


const app = express().use('*', cors());

getSchema().then(schema=>{
  app.use('/graphql', bodyParser.json(), graphqlExpress({
      schema,
      context: {}
  }));

  app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql'
  }));

  app.listen(8080, () => console.log(
      `GraphQL Server running on http://localhost:8080/graphql`
  ));
})
