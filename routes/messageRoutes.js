import express from 'express';
import { deleteMessage, getAllConversations, getAllMessages, sendMessage } from '../controllers/messagesController.js';

const Router = express.Router();
Router.route("/:id").get(getAllMessages).post(sendMessage).delete(deleteMessage);
Router.route('/conversations/all').get(getAllConversations);

export default Router