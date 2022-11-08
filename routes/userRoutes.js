import  express  from "express";
import {deleteUser,  disMatch,  getAllUsers,getAllUsersAdmin,getSingleUser,login, match, refresh, register, updateUser} from '../controllers/usersController.js';
import authorize from '../middlewares/authentication.js';
import handleUpload from '../handleUpload/index.js';

const upload = handleUpload("./uploads",[]);
const Router = express.Router();
Router.route('/').get(authorize,getAllUsers);
Router.route('/admin').get(authorize,getAllUsersAdmin);
Router.route('/auth/login').post(login);
Router.route('/match/:id').patch(authorize,match);
Router.route('/dismatch/:id').patch(authorize,disMatch);
Router.route('/refresh').patch(authorize,refresh);
Router.route('/auth/register').post(upload.single('profilePic'),register);
Router.route('/:id').patch(authorize,upload.single('profilePic'),updateUser).delete(authorize,deleteUser).get(getSingleUser);
export default Router