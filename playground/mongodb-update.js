const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log(`The following error occurred while trying to connect to database: ${err}`);
    }

    console.log('Connected to MongoDB');

    const db = client.db('TodoApp');

    db.collection('Todos').findOneAndUpdate(
        {_id: new ObjectID('5aed288a5b3f92c87b057b0c')},
        {$set: {completed: true}},
        {returnOriginal: false}
    ).then(result => {
        console.log(result);
    });

    db.collection('Users').findOneAndUpdate(
        {_id: new ObjectID('5aed317cfbcec3c9ba2d8dcf')},
        {$set: {name: 'blah'}, $inc: {age: 1}},
        {returnOriginal: false}
    ).then(result => {
        console.log(result);
    })

    client.close();
});
