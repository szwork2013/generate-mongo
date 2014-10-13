'use strict';

var assert = require('assert'),
    mongoose = require('mongoose'),
    gen = require('./../'),
    desc = require('./db/desc.json'),
    utils = require('../lib/utils.js');


describe('mongoose gen disk storare', function() {
    before(function() {
        this.connection = mongoose.connect('mongodb://localhost:27017/mongo-gen');
        gen.setConnection(this.connection);
        this.Model = gen.schema('Test', desc);
    });
    
    afterEach(function(done) {
        this.Model.collection.remove(done);
    });
    

});
