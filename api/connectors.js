var bll = require('../bll/bll');
var router = require('express').Router();

router.use((req, res, next) => {
	next();
});

router.post('/get', (req, res) => {
	var myModule = new bll.module();
	myModule.connectors.get(req, res);
});

router.post('/list', (req, res) => {
	var myModule = new bll.module();
	myModule.connectors.list(req, res);
});

module.exports = router;