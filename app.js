const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const Painting = require('./models/Painting')
const schema = require('./graphql/schema');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const bodyParser = require('body-parser');
const Pack = require('./package')

mongoose.connect('mongodb://salmandoo:salmandoo1@ds251284.mlab.com:51284/salmandoo',
	{ useNewUrlParser : true});

mongoose.connection.once('open' , () => {
	console.log('connected to DB')
})

const PORT = process.env.PORT || 4000;
const app = express();
const server = new ApolloServer({ schema});

//app.use(express.static(path.join(__dirname , 'client/build')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));



app.route('/api/v1/paintings').get((req, reply) => {
	return Painting.find().then(c => reply.json(c))
}).post((req,reply) => {
	const { name, url, technique } = req.body;
				const painting = new Painting({
					name,
					url,
					technique
				});

	painting.save().then(doc => reply.json(doc));
})


/*app.get('*' , (req , res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'))
})
*/


server.applyMiddleware({app})

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)

})