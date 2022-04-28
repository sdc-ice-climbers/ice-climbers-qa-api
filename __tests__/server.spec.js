require('dotenv').config();
const pactum = require('pactum');
const stub = require('./stubs/stubs.js');
let timeout = 100000;

beforeAll(() => {
  pactum.request.setBaseUrl(`http://${process.env.DB_HOST}:${process.env.PORT}/`);
  jest.setTimeout(timeout);
});

describe('GET all questions',() => {

  test('Should return status 200 when no count or page are provided', async function () {
    await pactum.spec()
      .withRequestTimeout(timeout)
      .get('qa/questions?product_id=1000')
      .expectStatus(200)
  });

  test('Should return status 200 when count and page are provided', async function () {
    await pactum.spec()
      .withRequestTimeout(timeout)
      .get('qa/questions?count=5&page=1&product_id=1')
      .expectStatus(200)
  });

  test('Should return status 422 when no product id is provided', async function () {
    await pactum.spec()
      .withRequestTimeout(timeout)
      .get('qa/questions/')
      .expectStatus(422)
  });

  test('Results should be empty on page 2 with count of 5', async function () {
    await pactum.spec()
      .withRequestTimeout(timeout)
      .get('qa/questions?count=5&page=2&product_id=1')
      .expectJson({
        "product_id": "1",
        "results": []
    })
  });
});

describe('GET all answers',() => {

  test('Should return status 200', async function () {
    await pactum.spec()
      .get('qa/questions/1000/answers')
      .expectStatus(200)
  })

  test('Should return status 422 when sending in wrong question id', async function () {
    await pactum.spec()
      .get('qa/questions/blah/answers')
      .expectStatus(422)
  })
});

describe('POST questions',() => {

  test('Should return status 204 when sending in a body', async function () {
    await pactum.spec()
      .post('qa/questions/')
      .withBody(stub.goodQuestion)
      .expectStatus(204)
  })

  test('Should return status 204 when sending in no body', async function () {
    await pactum.spec()
      .post('qa/questions/')
      .expectStatus(422)
  })
});

describe('POST answers',() => {

  test('Should return status 204 when sending in a body', async function () {
    await pactum.spec()
      .post('qa/questions/1000/answers')
      .withBody(stub.goodAnswer)
      .expectStatus(204)
  })

  test('Should return status 422 when sending no body', async function () {
    await pactum.spec()
      .post('qa/questions/1000/answers')
      .expectStatus(422)
  })
});

describe('PUT increase question helpfulness',() => {

  test('Should return status 204 sending correct question id', async function () {
    await pactum.spec()
      .put('qa/questions/59825/helpful')
      .expectStatus(204)
  })

  test('Should return status 422 when sending bad question id', async function () {
    await pactum.spec()
      .put('qa/questions/5678908765789/helpful')
      .expectStatus(422)
  })
});

describe('PUT increase answer helpfulness',() => {

  test('Should return status 204 sending correct answer id', async function () {
    await pactum.spec()
      .put('qa/answers/39328/helpful')
      .expectStatus(204)
  })

  test('Should return status 422 when sending bad answer id', async function () {
    await pactum.spec()
      .put('qa/answers/3923435523328/helpful')
      .expectStatus(422)
  })
});

describe('PUT report question',() => {

  test('Should return status 204 sending correct question id', async function () {
    await pactum.spec()
      .put('qa/questions/35969/report')
      .expectStatus(204)
  })

  test('Should return status 422 when sending bad question id', async function () {
    await pactum.spec()
      .put('qa/questions/3518912312369/report')
      .expectStatus(422)
  })
});

describe('PUT report answer',() => {

  test('Should return status 204 sending correct answer id', async function () {
    await pactum.spec()
      .put('qa/answers/8/report')
      .expectStatus(204)
  })

  test('Should return status 422 when sending bad answer id', async function () {
    await pactum.spec()
      .put('qa/answers/82143468976543/report')
      .expectStatus(422)
  })
});