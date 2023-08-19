# Distributed Algorithms & Data Structures Homework: DBs performance benchmarking

This performance benchmarking compares the following DBMSs:
- PostgreSQL 15.4
- MySQL 8.1
- Mongo 6.0.8

The DBMSs were running in docker containers using official images. *So this is a performance benchmark of databases running in docker containers,* because the main goal was to learn how to test databases. The methodology used can be easily applied to databases running on hardware.

The test was performed on the host with 8 CPU cores, 32GB RAM, SSD drive using Ubuntu 22.04.

For this benchmark I've forked the [YCSB](https://github.com/brianfrankcooper/YCSB) tool by adding support for PostgreSQL (jsonb) and MySQL (binary json).

Data structures used in the benchmark:

- PostgreSQL

    A table with single `JSONB` column with single path index created using regular functional index.
    ```sql
    CREATE TABLE IF NOT EXISTS usertable(data JSONB);
    CREATE UNIQUE INDEX IF NOT EXISTS usertable_data_idx ON usertable ((data->>'YCSB_KEY'));
    ```
    It has been decided to uses the JSONB since:
    > The json and jsonb data types accept almost identical sets of values as input. The major practical difference is one of efficiency. The json data type stores an exact copy of the input text, which processing functions must reparse on each execution; while jsonb data is stored in a decomposed binary format that makes it slightly slower to input due to added conversion overhead, but significantly faster to process, since no reparsing is needed. jsonb also supports indexing, which can be a significant advantage.

- MySQL

    A table with single `JSON` column with virtual column and index on it (MySQL does not suuport indexing binary json).
    ```sql
    CREATE TABLE test.usertable (
        data json,
        ycsb_key varchar(255) GENERATED ALWAYS AS (JSON_EXTRACT(data, '$.YCSB_KEY')) STORED PRIMARY KEY);
    ```

- MongoDB

    A collection with unique index on the _id field created by default during the creation of a collection.
    ```js
    db.createCollection('usertable')
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

To prepare the testing env run the following command:
```sh
pip install -r requirements.txt
./setup_tests.py
docker compose build
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

Remove images, volumes, etc.
```sh
docker compose down --rmi all -v --remove-orphans
```
