const {MongoClient, ObjectID} = require('mongodb');

// const obj = new OjbectID();
// console.log(`ObjectID: ${obj}`);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log(`The following error occurred while trying to connect to database: ${err}`);
    }

    console.log('Connected to MongoDB');

    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something else to do',
    //     completed: true
    // }, (err, result) => {
    //     if (err) {
    //         return console.log(`Failed to save todo with error: ${err.toString()}`);
    //     }
    //
    //     console.log(JSON.stringify(result.ops, undefined, 4));
    // });

    db.collection('Users').insertOne({
        name: 'Jan',
        age: 33,
        location: 'Kingston'
    }, (err, result) => {
        if (err) {
            return console.log(`Failed to save user with error: ${err.toString()}`);
        }

        console.log(JSON.stringify(result.ops, undefined, 4));
    });

    client.close();
})
