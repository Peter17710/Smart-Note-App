import Joi from 'joi';

export const createNoteSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.min': 'Title should have a minimum length of {#limit}',
      'string.max': 'Title should have a maximum length of {#limit}',
      'string.empty': 'Title cannot be empty',
      'any.required': 'Title is required',
    }),
  content: Joi.string()
    .min(5)
    .messages({
      'string.min': 'Content should have a minimum length of {#limit}',
      'string.empty': 'Content cannot be empty',
    }),
  userId: Joi.string() 
    .required()
    .messages({
      'string.empty': 'User ID cannot be empty',
      'any.required': 'User ID is required',
    }),
});

export const updateNoteSchema = Joi.object({
  noteId: Joi.string() 
    .required()
    .messages({
      'string.empty': 'Note ID cannot be empty',
      'any.required': 'Note ID is required',
    }),
  title: Joi.string()
    .min(3)
    .max(255)
    .messages({
      'string.min': 'Title should have a minimum length of {#limit}',
      'string.max': 'Title should have a maximum length of {#limit}',
      'string.empty': 'Title cannot be empty',
    }),
  content: Joi.string()
    .min(5)
    .messages({
      'string.min': 'Content should have a minimum length of {#limit}',
      'string.empty': 'Content cannot be empty',
    }),
}).min(2);
