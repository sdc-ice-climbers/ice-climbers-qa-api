![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white&link=https://github.com/kevinzhugao)](https://github.com/OwenMY)

# Questions and Answers API service
The Questions and Answers API has been refractored as a microservice from the existing monolithic API for the e-commerce website, Atelier. It responds to several RESTful endpoints and has been optimized to handle web-scale traffic.

### *Optimizations:*
- Implemented an ETL process to migrate over 5GB/13M+ entries into a redesigned postgreSQL database.
- Scaled horizontally to a micro-service architecture with 4 AWS EC2 instances.
- Installed an NGINX load balancer to distribute traffic across servers and utilize proxy_caching.

<br>

## Stress Testing
#### Randomized selections from bottom 20% of 13M+ entry dataset @ 1000RPS

| Optimization                                   | Clients Per Sec | Avg. Response Time | Error % |
|------------------------------------------------|-----------------|--------------------|---------|
| (1) EC2 W/ PostgreSQL on AWS                   |       1000      |       2763ms       | 0.1%    |
| (2) EC2 W/ NGINX Load Ballancer                |       1000      |       1496 ms      | 1.7%    |
| (3) EC2 W/ NGINX Load Ballancer & Proxy Cache  |       1000      |       889 ms       | 2.5%    |
| (4) EC2 W/ NGINX Load Ballancer & Proxy Cache  |       1000      |        73ms        | 0.0%    |

<br>

### Getting Started
1. From a terminal, clone from [this](https://github.com/sdc-ice-climbers/ice-climbers-qa-api.git) repo.
```
git clone https://github.com/sdc-ice-climbers/ice-climbers-qa-api.git
```
2. Install dependencies
```
npm install
```

3. Follow the steps in [README](https://github.com/sdc-ice-climbers/ice-climbers-qa-api/blob/main/server/README.md) file in the server folder to set up the database.

4. Configure your .env file (see example.env).

5. Start up server
```
npm start
```

## To run the tests
```
npm test
```

## API Endpoints
### GET /qa/questions

Retrieves a list of questions for a product.

#### Parameters
Parameters should be query strings.

| **Parameter** | **Type** | **Description**                                 |
|---------------|----------|-------------------------------------------------|
| product_id    | integer  | Product for which to retrieve questions.        |
| page          | integer  | Selects the page of results. Default 1.         |
| count         | integer  | Specifies how many results per page. Default 5. |

#### Response status: 200 OK
```json
{
  "product_id": "5",
  "results": [{
        "question_id": 37,
        "question_body": "Why is this product cheaper here than other sites?",
        "question_date": "2018-10-18T00:00:00.000Z",
        "asker_name": "williamsmith",
        "question_helpfulness": 4,
        "reported": false,
        "answers": {
          68: {
            "id": 68,
            "body": "We are selling it here without any markup from the middleman!",
            "date": "2018-08-18T00:00:00.000Z",
            "answerer_name": "Seller",
            "helpfulness": 4,
            "photos": []
            // ...
          }
        }
      },
      {
        "question_id": 38,
        "question_body": "How long does it last?",
        "question_date": "2019-06-28T00:00:00.000Z",
        "asker_name": "funnygirl",
        "question_helpfulness": 2,
        "reported": false,
        "answers": {
          70: {
            "id": 70,
            "body": "Some of the seams started splitting the first time I wore it!",
            "date": "2019-11-28T00:00:00.000Z",
            "answerer_name": "sillyguy",
            "helpfulness": 6,
            "photos": [],
          },
          78: {
            "id": 78,
            "body": "9 lives",
            "date": "2019-11-12T00:00:00.000Z",
            "answerer_name": "iluvdogz",
            "helpfulness": 31,
            "photos": [],
          }
        }
      },
      // ...
  ]
}
```

### GET /qa/questions/:question_id/answers

Retrieves a list of answers for a question.

#### Parameters
Endpoint should contain question_id parameter. Page and count should be query strings.

| **Parameter** | **Type** | **Description**                                 |
|---------------|----------|-------------------------------------------------|
| question_id   | integer  | Question for which to retrieve answers.         |
| page          | integer  | Selects the page of results. Default 1.         |
| count         | integer  | Specifies how many results per page. Default 5. |

#### Response status: 200 OK
```json
{
  "question": "1",
  "page": 0,
  "count": 5,
  "results": [
    {
      "answer_id": 8,
      "body": "What a great question!",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 8,
      "photos": [],
    },
    {
      "answer_id": 5,
      "body": "Something pretty durable but I can't be sure",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/answer_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/answer_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    // ...
  ]
}
```

### POST /qa/questions/

Adds a question for the given product.

#### Parameters
Parameters should be in the body in json form.

| **Parameter** | **Type** | **Description**                                 |
|---------------|----------|-------------------------------------------------|
| body          | text     | Text of question being asked.                   |
| name          | text     | Asker username.                                 |
| email         | text     | Asker email address.                            |
| product_id    | integer  | Product for which the question is being posted. |

#### Response status: 201 Created

### POST /qa/questions/:question_id/answers

Adds an answer for the given question.

#### Parameters
Endpoint should contain question_id paramenter. Body parameters should be in body in json form.

| **Parameter** | **Type** | **Description**                         |
|---------------|----------|-----------------------------------------|
| question_id   | integer  | Question for which to post the answer.  |

Body Parameters
| **Parameter** | **Type** | **Description**                        |
|---------------|----------|----------------------------------------|
| body          | text     | Text of answer being posted.           |
| name          | text     | Answerer name.                         |
| email         | text     | Answerer email address.                |
| photos        | [text]   | An array of urls of images to display. |

#### Response status: 201 Created

### PUT qa/questions/:question_id/helpful

Marks a question as helpful.

#### Parameters
Endpoint should contain question_id parameter.

| **Parameter** | **Type** | **Description**     |
|---------------|----------|---------------------|
| question_id   | integer  | Question to update. |

#### Response status: 204 NO CONTENT

### PUT qa/questions/:question_id/report

Reports a question. Note, this action does not delete the question, but the question will no longer be returned in the above GET request.

#### Parameters
Endpoint should contain question_id parameter.

| **Parameter** | **Type** | **Description**     |
|---------------|----------|---------------------|
| question_id   | integer  | Question to update. |

#### Response status: 204 NO CONTENT

### PUT qa/answers/:answer_id/helpful

Marks an answer as helpful.

#### Parameters
Endpoint should contain answer_id parameter.

| **Parameter** | **Type** | **Description**   |
|---------------|----------|-------------------|
| answer_id     | integer  | Answer to update. |

#### Response status: 204 NO CONTENT

### PUT qa/answers/:answer_id/report

Reports an answer. Note, this action does not delete the answer, but the answer will no longer be returned in the above GET request.

#### Parameters
Endpoint should contain answer_id parameter.

| **Parameter** | **Type** | **Description**   |
|---------------|----------|-------------------|
| answer_id     | integer  | Answer to update. |

#### Response status: 204 NO CONTENT
