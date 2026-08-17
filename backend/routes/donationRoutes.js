const router=require('express').Router();
const auth=require('../middleware/auth');
const c=require('../controllers/donationController');
router.use(auth);
router.get('/mine',c.mine);
router.post('/',c.create);
module.exports=router;
