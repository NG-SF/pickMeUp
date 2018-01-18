global.DATABASE_URL = 'mongodb://localhost/test-users';
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users/models');

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

describe('User authorization routes', function() {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';
  const usernameB = 'exampleUserB';
  const passwordB = 'examplePassB';
  const firstNameB = 'ExampleB';
  const lastNameB = 'UserB';

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return User.remove({});
  });

  afterEach(function() {
    return User.remove({});
  });

describe('CREATE USER Route', function() {
  it('Should reject users with missing username', function() {
        return chai
          .request(app)
          .post('/users/create')
          .send({
            password,
            firstName,
            lastName
          })
          .then(function() {
            expect.fail(null, null, 'Request should not succeed');
          })
          .catch(function(err) {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
      });

      it('Should reject users with missing password', function() {
        return chai
          .request(app)
          .post('/users/create')
          .send({
            username,
            firstName,
            lastName
          })
          .then(function() {
            expect.fail(null, null, 'Request should not succeed');
          })
          .catch(function(err) {
            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            // expect(res.body.location).to.equal('password');
          });
      });

    xit('Should reject users with non-string username', function() {
        return chai
          .request(app)
          .post('/users/create')
          .send({
            username: 1234,
            password,
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(function(err) {
            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('username');
          });
      });

it('Should reject users with non-trimmed username', function() {
        return chai
          .request(app)
          .post('/users/create')
          .send({
            username: ` ${username} `,
            password,
            firstName,
            lastName
          })
          .then(function() {
            expect.fail(null, null, 'Request should not succeed');
          })
          .catch(function(err) {
            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            // expect(res.body.message).to.equal(
            //   'Cannot start or end with whitespace'
            // );
            expect(res.body.location).to.equal('username');
          });
      });

  it('Should reject users with non-trimmed password', function() {
        return chai
          .request(app)
          .post('/users/create')
          .send({
            username,
            password: ` ${password} `,
            firstName,
            lastName
          })
          .then(function() {
            expect.fail(null, null, 'Request should not succeed');
          })
          .catch(function(err) {
            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            // expect(res.body.message).to.equal(
            //   'Cannot start or end with whitespace'
            // );
            // expect(res.body.location).to.equal('password');
          });
      });

it('Should reject users with empty username', function() {
        return chai
          .request(app)
          .post('/users/create')
          .send({
            username: '',
            password,
            firstName,
            lastName
          })
          .then(function() {
            expect.fail(null, null, 'Request should not succeed');
          })
          .catch(function(err) {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            // expect(res.body.message).to.equal(
            //   'Must be at least 1 characters long'
            // );
            expect(res.body.location).to.equal('username');
          });
      });

it('Should reject users with password less than 5 characters', function() {
        return chai
          .request(app)
          .post('/users/create')
          .send({
            username,
            password: '123',
            firstName,
            lastName
          })
          .then(function() {
            expect.fail(null, null, 'Request should not succeed');
          })
          .catch(function(err){
            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            // expect(res.body.message).to.equal(
            //   'Must be at least 5s characters long'
            // );
            // expect(res.body.location).to.equal('password');
          });
      });

it('Should reject users with password greater than 15 characters', function() {
        return chai
          .request(app)
          .post('/users/create')
          .send({
            username,
            password: 'aaaaaaaaaaaaaaaaa',
            firstName,
            lastName
          })
          .then(function () {
            expect.fail(null, null, 'Request should not succeed');
          })
          .catch(function(err) {
            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            // expect(res.body.message).to.equal(
            //   'Must be at most 15 characters long'
            // );
          //   expect(res.body.location).to.equal('password');
          });
      });
it('Should reject users with duplicate username', function() {
        // Create an initial user
        return User.create({
          username,
          password,
          firstName,
          lastName
        })
          .then(function () {
            // Try to create a second user with the same username 
            return chai.request(app).post('/users/create').send({
              username,
              password,
              firstName,
              lastName
            });
          })
          .then(function() {
            expect.fail(null, null, 'Request should not succeed');
          })
          .catch(function(err) {
            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            // expect(res.body.message).to.equal(
            //   'Username already taken'
            // );
            expect(res.body.location).to.equal('username');
          });
      });
  xit('Should create a new user', function() {
    const newUser = {
      username:'user333',
      password: 'password333',
      firstName: 'Jack',
      lastName: 'Carter'
    };
    let res;
        return chai
          .request(app)
          .post('users/create')
          .send(newUser)
          .then(function(_res) {
          res = _res;  

          expect.success('Request should succeed');
          // expect(res).to.have.status(201);
          // expect(res.body.id).to.not.be.null;
          // expect(res.body.username).to.equal(newUser.username);
          // expect(res.body.firstName).to.equal(newUser.firstName);
          // expect(res.body.lastName).to.equal(newUser.lastName);
            console.log(res);
            // expect(res.redirect).to.equal(`/jokes/users/${user._id}`);
            return User.findById(res.body.id);
          })
          .then(function(user) {
          // expect(user.username).to.equal(newUser.username);
          // expect(user.firstName).to.equal(newUser.firstName);
          // expect(user.lastName).to.equal(newUser.lastName);
        })
          .catch( function(err) {
            const res = err.response;
            expect(res).to.have.status(500);
          });
      });

});  // end describe users/create/route

  describe('LOGIN USER Route', function() {
      it('Should reject users with missing username', function() {
        return chai
          .request(app)
          .post('/users/login')
          .send({
            password,
            firstName,
            lastName
          })
          .catch(function(err)  {
            const res = err.response;
            expect(res).to.have.status(403);
          });
          
      });

      it('Should reject users with missing password', function() {
        return chai
          .request(app)
          .post('/users/login')
          .send({
            username,
            firstName,
            lastName
          })
          .then(function () {
            expect.fail(null, null, 'Request should not succeed');
          }
          )
          .catch(function(err) {
            const res = err.response;
            expect(res).to.have.status(403);
          });
      });  

it('Should reject users with non-trimmed username', function() {
        return chai
          .request(app)
          .post('/users/create')
          .send({
            username: ` ${username} `,
            password,
            firstName,
            lastName
          })
          .then(function() {
            expect.fail(null, null, 'Request should not succeed');
          })
          .catch(function(err) {
            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            // expect(res.body.message).to.equal(
            //   'Cannot start or end with whitespace'
            // );
            expect(res.body.location).to.equal('username');
          });
      });

  it('Should reject users with non-trimmed password', function() {
        return chai
          .request(app)
          .post('/users/create')
          .send({
            username,
            password: ` ${password} `,
            firstName,
            lastName
          })
          .then(function() {
            expect.fail(null, null, 'Request should not succeed');
          })
          .catch(function(err) {
            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            // expect(res.body.message).to.equal(
            //   'Cannot start or end with whitespace'
            // );
            // expect(res.body.location).to.equal('password');
          });
      });

  });

});
