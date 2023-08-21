import express from 'express';
import * as controller from '../controllers/beneficiary';
import * as auth from '../middlewares/auth';

const router = express.Router()
router.post('/', auth.allowIfLoggedin, function (req, res, next) {
    
    if (res.locals.loggedInUser.abilities.can('create', 'beneficiary')) {
        console.log("funciona")
        res.json({ message: 'This is an admin resource.' });
    } else {
        res.status(403).json({ message: 'You do not have permission to access this resource.' });
    }

}, controller.save);
router.get("/", auth.allowIfLoggedin, controller.getAll)
router.get('/:id', auth.allowIfLoggedin, controller.get);
router.put('/:id', auth.allowIfLoggedin, controller.update);
router.delete('/:id', auth.allowIfLoggedin, controller.deleteItem);

export default router;