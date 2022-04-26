import http from 'k6/http';
import { sleep } from'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 }, // below normal load
    { duration: '1m', target: 100 },
    { duration: '10s', target: 1400 }, // spike to 1400 users
    { duration: '3m', target: 1400 }, // stay at 1400 for 3 minutes
    { duration: '10s', target: 100 }, // scale down. Recovery stage.
    { duration: '3m', target: 100 },
    { duration: '10s', target: 0 },
  ],
};

const randomProductId = function(max) {
  return Math.floor(Math.random() * max) + 1;
}

export default function () {
  const URL = `http://localhost:1129`

  const responses = http.batch([
    ['GET', `${URL}/qa/questions?product_id=${randomProductId(1000000)}`, null, {}],
    ['GET', `${URL}/qa/questions/${3000000}/answers`, null, {}]
  ]);

  sleep(1)
};
