const chai = require('chai'),
      chaiHttp = require('chai-http'),
      faker = require('faker'),
      mongoose = require("mongoose"),
      moment = require('moment'),
      expect = chai.expect,
      should = chai.should(),
      {TEST_DATABASE_URL} = require('../config'),
      { Joke } = require('../jokes/models'),
      { User } = require('../users/models'),
      { app, runServer, closeServer } = require('../server');

chai.use(chaiHttp);

// generate documents for testing using Faker library
function seedJokesData() {
  console.info('seeding data');
  const seedData = [];
  
  for (let i=1; i<=10; i++) {
    seedData.push(generateJokesData());
  }
  return Joke.insertMany(seedData);
}

const testUser = {
  firstName: 'Jane',
  lastName: 'Doe',
  username: 'janeD',
  password: 'sunflower',
  id: 'aaaaa55555bbbbb77777'
};

// generate an object representing a joke post
// can be used to generate seed data for db
// or request.body data
function generateJokesData() {
  return { 
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    image: faker.image.imageUrl(),
    userId: testUser.id
};
}
// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Jokes/Users/ID API resource', function() {
  
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedJokesData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

describe('GET endpoint', function() {

  it('should return all existing jokes for individual user', function() {

let res;
    return chai.request(app)
      .get(`/jokes/`)
      .then(function(_res) {
// so subsequent .then blocks can access response object
        res = _res;
        expect(res).to.have.status(200);
        return Joke.count();
      })
      .then(function(count) {
        expect(count).to.be.equal(10);
      })
      .catch(function (err) {
            throw err;
          });

  });
  });


describe('POST endpoint', function() {
// strategy: make a POST request with data,
// then prove that the blog we get back has
// right keys, and that `id` is there (which means
// the data was inserted into db)
  xit('should add a new joke', function() {
    const newJoke = generateJokesData();
 
    });
  });
 
describe('PUT endpoint', function() {
// strategy:
//1. Get an existing blog post from db
//2. Make a PUT request to update that post
//3. Prove post returned by request contains data we sent
//4. Prove post in db is correctly updated
  xit('should update fields you send over', function() {
    const updateData = {
      title: 'This is a test',
      content: 'star wars, star trek and harry potter'
      };

    });
  });

  describe('DELETE endpoint', function() {
// strategy:
//1. get a blog post
//2. make a DELETE request for that post's id
//3. assert that response has right status code
//4. prove that post with the id doesn't exist in db anymore
    xit('should delete a joke by id', function() {
      let joke;

    });
  });

});

