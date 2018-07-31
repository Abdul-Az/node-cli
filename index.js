var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var morgan = require('morgan');
var mongoose = require('mongoose');


app.use(express.static(__dirname + '/data'));
app.use('/data/uploads', express.static(__dirname + '/data/uploads'));
app.use(morgan('dev'));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// mongodb
Module = require('./models/schema');
mongoose.connect("mongodb://localhost:27017/sample", { useNewUrlParser: true });
var db = mongoose.connection;

// Store
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/uploads/');
    },
    filename: function (req, file, cb) {

        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});


var uploadSingle = multer({
    storage: storage
}).single('universe');


app.get('*', function (req, res) {
    res.sendfile('./data/uploads');
});

// Post call
app.post('/api/v1/module', function (req, res) {

    uploadSingle(req, res, function (err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }

        var module = new Module({
            originalname: req.file.originalname
        });
        Module.addModule(module, function (err, module) {
            if (err) {
                throw err;
            }
            app.set('json spaces', 2);
            res.json(module);
        });
    });
});


// Get call
app.get('/api/v1/modules', function (req, res) {
    Module.getModule(function (err, module) {

        if (err) {
            throw err;
        }
        app.set('json spaces', 2);
        res.json(module);
    });

});

// Delete call
app.delete('/api/v1/modules/:originalname', function (req, res) {
    var originalname = req.params.originalname;
    Module.deleteModule(originalname, function (err, module) {
        if (err) {
            console.log(err);
        }
        app.set('json spaces', 2);
        res.json(module);
    });
});


app.listen(process.env.PORT || 3000, function () {
    console.log("App listening on port 3000");
});

