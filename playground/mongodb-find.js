const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log(`The following error occurred while trying to connect to database: ${err}`);
    }

    console.log('Connected to MongoDB');

    const db = client.db('TodoApp');

    // db.collection('Todos').find({completed: true}).toArray().then((docs) => {
    //     console.log(JSON.stringify(docs, undefined, 4));
    // }).catch(err => {
    //     console.log(`Failed to fetch data with error: ${err}`);
    // });
    //
    // db.collection('Todos').find({}).count().then(count => {
    //     console.log(`Total number of Todos: ${count}`);
    // }).catch(err => {
    //     console.log(`Failed to count records: ${err}`);
    // });

    const queryObj = {name: 'Jan'};
    db.collection('Users').find(queryObj).toArray().then(docs => {
        console.log(JSON.stringify(docs, undefined, 4));
    }).catch(err => {
        console.log(`Failed to retrieve data with error: ${err}`);
    });

    db.collection('Users').find(queryObj).count().then(count => {
        console.log(`Found a total of: ${count} result(s)`);
    }).catch(err => {
        console.log(`Failed to retrieve data with error: ${err}`);
    });

    client.close();
});
