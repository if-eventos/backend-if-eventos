const express = require("express");
const router = express.Router();
const middleware = require("../middleware");


//API:
const userAPI = require("./api_user");
const eventoAPI = require("./api_evento");
const ouvinteAPI = require("./api_ouvinte");
const palestranteAPI = require("./api_palestrante");

router.use(middleware.initLocals);

router.get('/', (req, res)=>{
    res.redirect('/docs');
})


router.use('/api/v1/user', userAPI);
router.use('/api/v1/evento', eventoAPI);
router.use('/api/v1/ouvinte', ouvinteAPI);
router.use('/api/v1/palestrante', palestranteAPI);
// router.use('/api/v1/evento', eventoAPI);


module.exports = router;