var bll		= require('../bll/bll');
var router	= require('express').Router();

router.use(function timeLog(req, res, next) {
  	next();
});

router.post('/add', (req, res) => {
	var myModule = new bll.module();
	myModule.schedule.add(req, res);
});

router.post('/get', (req, res) => {
	var myModule = new bll.module();
	myModule.schedule.get(req, res);
});

router.post('/list', (req, res) => {
	var myModule = new bll.module();
	myModule.schedule.list(req, res);
});

router.post('/share', (req, res) => {
    var myModule = new bll.module();
    myModule.schedule.share(req, res);
});

router.post('/update', (req, res) => {
	var myModule = new bll.module();
	myModule.schedule.update(req, res);
});

router.post('/delete', (req, res) => {
	var myModule = new bll.module();
	myModule.schedule.delete(req, res);
});

router.post('/unsubscribe', (req, res) => {
    var myModule = new bll.module();
    myModule.schedule.unsubscribe(req, res);
});

router.post('/updatesubscriber', (req, res) => {
    var myModule = new bll.module();
    myModule.schedule.updatesubscriber(req, res);
});

module.exports = router;