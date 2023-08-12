# Distributed Algorithms & Data Structures Homework: DBs performance benchmarking

This performance benchmarking compares the following DBMSs:
- PostgreSQL 15.4
- MySQL 8.1
- Mongo 6.0.8

The test consists of the following parts:
- Setup testing env
- Prepare and describe testing scenarios
- Create a testing app
- Prepare test data
- Perform benchmarks in different configurations (default/majority read-write resp, …)
- Analyze results

## Setup testing env
...

## Prepare and describe testing scenarios
...

## Create a testing app
...

## Prepare test data
...

## Perform benchmarks in different configurations (default/majority read-write resp, …)
...

## Analyze results
...






## Start
```sh
docker compose build
docker compose up -d
```

### Run tests

```sh
./run_tests.sh
```

## Stop
```sh
docker compose down
```

## Clean-Up
```sh
docker compose down --rmi all -v --remove-orphans
```