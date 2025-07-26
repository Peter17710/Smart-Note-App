import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { schema, summarizeNote } from './notesControllers.js';
import { ruruHTML } from 'ruru/server';

const graphQlRouter = express.Router();

// A new GET route to serve the GraphiQL IDE
graphQlRouter.get('/', (req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

graphQlRouter.post('/:id/summarize', summarizeNote);

graphQlRouter.use(
  '/graphql',
  createHandler({
    schema: schema,
  })
);
 
export default graphQlRouter;