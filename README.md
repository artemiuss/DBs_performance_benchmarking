# Distributed Algorithms & Data Structures Homework: DBs performance benchmarking

This performance benchmarking compares the following DBMSs:
- PostgreSQL 15.4
- MySQL 8.1
- Mongo 6.0.8

The DBMSs were running in docker containers using official images.

The test was performed on machine with 8 CPU cores, 32GB RAM, SSD drive using Ubuntu 22.04 using Python 3.11.3 and the following libraries:
```
psycopg2==2.9.6
pymongo==4.4.1
mysql-connector-python==8.1.0
```

The test consists of the following parts:
- Setup testing env
- Prepare and describe testing scenarios
- Create a testing app
- Prepare test data
- Perform benchmarks in different configurations (default/majority read-write resp, …)
- Analyze results

## Setup testing env

The testing DB instances have been defined in the `docker-compose.yml` file.

To start up the testing env run the following commands:
```sh
docker compose build
docker compose up -d
```

To prepare the testing env run the following command:
```sh
pip install -r requirements.txt
./setup_tests.py
```

### Data structures

#### PostgreSQL

```sql
CREATE TABLE test (
  id       SERIAL NOT NULL PRIMARY KEY,
  json_doc JSONB NOT NULL
);
```

It has been decided to uses the JSONB since:
> The json and jsonb data types accept almost identical sets of values as input. The major practical difference is one of efficiency. The json data type stores an exact copy of the input text, which processing functions must reparse on each execution; while jsonb data is stored in a decomposed binary format that makes it slightly slower to input due to added conversion overhead, but significantly faster to process, since no reparsing is needed. jsonb also supports indexing, which can be a significant advantage.

#### MySQL

```sql
CREATE TABLE test (
  id       INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  json_doc JSON NOT NULL
);
```

#### MongoDB
```js
db.createCollection('test')
```


## Prepare and describe testing scenarios
...

## Create a testing app
...

## Prepare test data
...

## Perform benchmarks in different configurations (default/majority read-write resp, …)
...
### Run tests
```sh
./run_tests.sh
```

## Analyze results
...

## Clean-Up

### Stop
```sh
docker compose down
```

### Remove images, volumes, etc.
```sh
docker compose down --rmi all -v --remove-orphans
```
