const bll = require('../bll/bll');
const router = require('express').Router();

router.use((req, res, next) => {
	next();
});

router.post('/add', (req, res) => {
	var myModule = new bll.module();
	myModule.reports.add(req, res);
});

router.post('/get', (req, res) => {
	var myModule = new bll.module();
	myModule.reports.get(req, res);
});

router.post('/list', (req, res) => {
	var myModule = new bll.module();
	myModule.reports.list(req, res);
});

router.post('/data', (req, res) => {
	var myModule = new bll.module();
	myModule.reports.data(req, res);
});

router.post('/share', (req, res) => {
	var myModule = new bll.module();
	myModule.reports.share(req, res);
});

router.post('/update', (req, res) => {
	var myModule = new bll.module();
	myModule.reports.update(req, res);
});

router.post('/delete', (req, res) => {
	var myModule = new bll.module();
	myModule.reports.delete(req, res);
});

router.post('/unsubscribe', (req, res) => {
	var myModule = new bll.module();
	myModule.reports.unsubscribe(req, res);
});

router.post('/change-owner', (req, res) => {
	var myModule = new bll.module();
	myModule.reports.changeowner(req, res);
});

router.post('/update-subscriber', (req, res) => {
	var myModule = new bll.module();
	myModule.reports.updatesubscriber(req, res);
});

module.exports = router;