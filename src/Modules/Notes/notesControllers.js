import { Note } from './../../../db/models/notes.model.js';
import { User } from './../../../db/models/user.model.js';
import OpenAI from 'openai';
import 'dotenv/config';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}); 

import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
} from 'graphql';



const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const NoteType = new GraphQLObjectType({
  name: 'Note',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    notes: {
      type: new GraphQLList(NoteType),
      args: {
        userId: { type: GraphQLID },
        title: { type: GraphQLString },
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        const filter = {};
        if (args.userId) filter.userId = args.userId;
        if (args.title) filter.title = new RegExp(args.title, 'i');
        if (args.startDate || args.endDate) {
          filter.createdAt = {};
          if (args.startDate) filter.createdAt.$gte = new Date(args.startDate);
          if (args.endDate) filter.createdAt.$lte = new Date(args.endDate);
        }

        const page = args.page || 1;
        const limit = args.limit || 10;
        const skip = (page - 1) * limit;

        return await Note.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createNote: {
      type: NoteType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLString },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        const note = new Note({
          title: args.title,
          content: args.content,
          userId: args.userId,
        });
        return await note.save();
      },
    },

    updateNote: {
      type: NoteType,
      args: {
        noteId: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const updated = await Note.findByIdAndUpdate(
          args.noteId,
          {
            $set: {
              ...(args.title && { title: args.title }),
              ...(args.content && { content: args.content }),
            },
          },
          { new: true }
        );
        return updated;
      },
    },

    deleteNote: {
      type: GraphQLBoolean,
      args: {
        noteId: { type: new GraphQLNonNull(GraphQLID) },
        userId: { type: new GraphQLNonNull(GraphQLID) }, // authenticated user
      },
      resolve: async (parent, args) => {
        const note = await Note.findOne({ _id: args.noteId, userId: args.userId });
        if (!note) return false;

        await Note.findByIdAndDelete(args.noteId);
        return true;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});






export const summarizeNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }


    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // You can use any model you want here
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes notes into a single paragraph.',
        },
        {
          role: 'user',
          content: `Please summarize the following note content: ${note.content}`,
        },
      ],
      max_tokens: 150, // Adjust the max_tokens as needed for the summary length
    });

    const summary = completion.choices[0].message.content.trim();
    return res.status(200).json({ summary });
  } catch (err) {
    console.error('Error summarizing note:', err);
    return res.status(500).json({ message: 'Error summarizing note.' });
  }
};
