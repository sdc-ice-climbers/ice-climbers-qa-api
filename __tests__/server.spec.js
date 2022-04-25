require('dotenv').config();
const pactum = require('pactum');
const URL = `http://localhost:${process.env.PORT}/`;

let timeout = 100000;

describe('GET all questions',() => {
  jest.setTimeout(timeout)
  test('Should return status 200 when no count or page are provided', async function () {
    await pactum.spec()
      .withRequestTimeout(timeout)
      .get(URL + 'qa/questions?product_id=1000')
      .expectStatus(200)
  });

  test('Should return status 200 when count and page are provided', async function () {
    await pactum.spec()
      .withRequestTimeout(timeout)
      .get(URL + 'qa/questions?count=5&page=1&product_id=1')
      .expectStatus(200)
  });

  test('Should return status 422 when no product id is provided', async function () {
    await pactum.spec()
      .withRequestTimeout(timeout)
      .get(URL + 'qa/questions/')
      .expectStatus(422)
  });

  test('Results should be empty on page 2 with count of 5', async function () {
    await pactum.spec()
      .withRequestTimeout(timeout)
      .get(URL + 'qa/questions?count=5&page=2&product_id=1')
      .expectJson({
        "product_id": "1",
        "results": []
    })
  });
});

describe('GET all answers',() => {
  jest.setTimeout(timeout)
  test.only('Should return status 200', async function () {
    await pactum.spec()
      .get(URL + 'qa/questions/1000/answers')
      .expectStatus(200)
  })

  test.only('Should return status 404 when sending in wrong question id', async function () {
    await pactum.spec()
      .get(URL + 'qa/questions/blah/answers')
      .expectStatus(404)
  })
});
