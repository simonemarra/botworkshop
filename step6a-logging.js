require('dotenv-extended').load();
var builder      = require('botbuilder');
var restify      = require('restify');
var connector    = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot          = new builder.UniversalBot(connector);

bot.dialog('/', [
    function(session) {
        session.send('Hello');
    },
]);

// middleware for logging
bot.use({
    receive: function (event, next) {
        logUserConversation(event);
        next();
    },
    send: function (event, next) {
        logUserConversation(event);
        next();
    }
});

const logUserConversation = (event) => {
    console.log('[' + event.timestamp + '] message: ' + event.text + ', user: ' + event.address.user.name);
};

/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());