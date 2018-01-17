global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
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

  describe('/users/login Route', function() {
    describe('POST', function() {
      it('Should reject users with missing username', function() {
        return chai
          .request(app)
          .post('/users/login')
          .send({
            password,
            firstName,
            lastName
          })
          .catch(err => {

            const res = err.response;
            expect(res).to.have.status(403);
          });
          
      });

      xit('Should reject users with missing password', function() {
        return chai
          .request(app)
          .post('/users/login')
          .send({
            username,
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
          });
      });
    });
  });
});
