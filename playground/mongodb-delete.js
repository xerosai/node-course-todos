const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log(`The following error occurred while trying to connect to database: ${err}`);
    }

    console.log('Connected to MongoDB');

    const db = client.db('TodoApp');

    // delete many
    const manyObj = {text: 'Eat Lunch'};
    db.collection('Todos').deleteMany(manyObj).then(result => {
        console.log(result.result);
    }).catch(err => {
        console.log(`Failed to delete with error: ${err}`);
    });

    // delete one
    const oneObj = {text: 'Eat Lunch'};
    db.collection('Todos').deleteOne(oneObj).then(result => {
        console.log(result.result);
    }).catch(err => {
        console.log(`Failed to delete with error: ${err}`);
    });

    // find one and delete
    const findDelObj = {completed: false};
    db.collection('Todos').findOneAndDelete(findDelObj).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(`Failed to delete with error: ${err}`);
    });

    // delete many
    const delByDupNameObj = {name: 'Simon Neufville'};
    db.collection('Users').deleteMany(delByDupNameObj).then(result => {
        console.log(result.result);
    }).catch(err => {
        console.log(`Failed to delete many with error: ${err}`);
    })

    // delete by id
    const delByIdObj = {_id: new ObjectID('5aed317cfbcec3c9ba2d8dcf')};
    db.collection('Users').findOneAndDelete(delByIdObj).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(`Failed to delete by id with error: ${err}`);
    })

    client.close();
});
