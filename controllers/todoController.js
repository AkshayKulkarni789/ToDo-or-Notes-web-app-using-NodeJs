var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://root:root@todoapp-shard-00-00-auvn5.mongodb.net:27017,todoapp-shard-00-01-auvn5.mongodb.net:27017,todoapp-shard-00-02-auvn5.mongodb.net:27017/test?ssl=true&replicaSet=ToDoApp-shard-0&authSource=admin&retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true });

var todoSchema = new mongoose.Schema({
	item: String,
	user: String
});

module.exports = mongoose.model('Todo', todoSchema);