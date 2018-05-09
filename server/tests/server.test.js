const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/Todo');
const {User} = require('../models/User');

const todos = [
     {_id: new ObjectID(), text: 'Example todo one', completed: false},
     {_id: new ObjectID(), text: 'Example todo two', completed: true, completedAt: Date.now()},
     {_id: new ObjectID(), text: 'Final todo three', completed: false}
];

beforeEach(done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    }).catch(err => {
        done(err);
    });
});

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        const text = 'An example todo from testing';
        request(app).post('/todos').send({text}).expect(200).expect((res) => {
            expect(res.body.text).toBe(text);
        }).end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find({text}).then(todos => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch(err => done(err));
        })
    });

    it('should not create todo with invalid body data', (done) => {
        request(app).post('/todos').send({}).expect(400).end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.find().then(todos => {
                expect(todos.length).toBe(3);
                done();
            }).catch(err => done(err));
        })
    })
});

describe('GET /todos', () => {

    it('should get all todos', (done) => {
        request(app).get('/todos').expect(200).expect(res => {
            expect(res.body.todos.length).toBe(3);
        }).end(done);
    })
});

describe('GET /todos/:id', () => {

    it('should return todo doc', (done) => {
        request(app).get(`/todos/${todos[0]._id.toHexString()}`).expect(200).expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        }).end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        request(app).get(`/todos/${new ObjectID().toHexString()}`).expect(404).end(done);
    });

    it('should return 404 for non object ids', (done) => {
        request(app).get(`/todos/${todos[0]._id.toHexString()}321`).expect(404).end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const hexId = todos[1]._id.toHexString();

        request(app).delete(`/todos/${hexId}`).expect(200).expect(res => {
            expect(res.body.todo._id).toBe(hexId);
        }).end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.findById(hexId).then(todo => {
                expect(todo).toNotExist();
                done();
            }).catch(err => {
                return done(err);
            })
        })
    });

    it('should return 404 if todo not found', (done) => {
        const fakeId = new ObjectID().toHexString();

        request(app).delete(`/todos/${fakeId}`).expect(404).end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app).delete(`/todos/123`).expect(404).end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it ('should update the todo', (done) => {
        const hexId = todos[0]._id.toHexString();
        const text = 'This is the new text';
        request(app).patch(`/todos/${hexId}`).send({completed: true, text}).expect(200).expect(res => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('string');
        }).end(done);
    });

    it ('should clear completedAt when todo is not completed', (done) => {
        const hexId = todos[1]._id.toHexString();
        const text = 'This is the new old text';
        request(app).patch(`/todos/${hexId}`).send({completed: false, text}).expect(200).expect(res => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        }).end(done);
    });
})
