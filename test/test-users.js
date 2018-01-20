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
            return chai.request(app)
            .post('/users/create')
            .send({
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
          });
      });

it('Should reject users with incorrect password', function() {
     let count;   
    return User.create({
      username: 'apollo',
      password: 'battlestar888',
      firstName,
      lastName
      })
      .then(function(user) {
          return User.find({username: 'apollo'}).count();
      })
      .then(function(_count) {
        count = _count;
        expect(_count).to.equal(count);
        return chai.request(app)
          .post('/users/create')
          .send({username: 'apollo',
                password: 'battlestar',
                firstName,
                lastName});
          })
          .then(function() {
            expect.fail(null, null, 'Request should not succeed');
          })
          .catch(function(err) {
            const res = err.response;
            expect(res).to.have.status(422);
            // expect(res.body.message).to.equal(
            //   'Internal server error'
            // );
          });
      });

  });

});
