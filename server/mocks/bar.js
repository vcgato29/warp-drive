/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var barRouter = express.Router();

  barRouter.get('/', function(req, res) {
    res.send({
      'bar': []
    });
  });

  barRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  barRouter.get('/:id', function(req, res) {
    res.send({
      'bar': {
        id: req.params.id
      }
    });
  });

  barRouter.put('/:id', function(req, res) {
    res.send({
      'bar': {
        id: req.params.id
      }
    });
  });

  barRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/bar', require('body-parser').json());
  app.use('/api/bar', barRouter);
};
