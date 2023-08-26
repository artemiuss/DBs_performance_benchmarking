# Distributed Algorithms & Data Structures Homework: DBs performance benchmarking

This performance benchmarking compares the following DBMSs:
- PostgreSQL 15.4
- MySQL 8.1
- Mongo 6.0.8

The DBMSs were running in docker containers using official images. *So this is a performance benchmark of databases running in docker containers,* because the main goal was to learn how to test databases. The methodology used can be easily applied to databases running on hardware.

The test was performed on the host with 4 CPU cores, 8GB RAM, SSD drive using RHEL 9.2.

For this benchmark I've forked the [YCSB](https://github.com/brianfrankcooper/YCSB) tool by adding support for PostgreSQL (jsonb) and MySQL (binary json). YCSB settings used:
- `recordcount=1000` -- the number of records in the dataset at the start of the workload. used when loading for all workloads
- `operationcount=1000` -- the number of operations to perform in the workload
- `threadcount=[1,2,3,4,5,6,7,8]` -- number of YCSB client threads. Alternatively this may be specified on the command line
- `workload` -- workload class:
  - Workload A: Update heavy workload
  - Workload B: Read mostly workload
  - Workload C: Read only

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

## Setup Testing Environment

The testing DB instances have been defined in the `docker-compose.yml` file.

To prepare the testing env run the following command:
```sh
pip install -r requirements.txt
./setup_tests.py
```

## Run tests
```sh
./run_tests.sh
```

## Testing Scenarios

YCSB includes a set of core workloads that define a basic benchmark for cloud systems. The following workloads were used in this benchmark:
- Workload A: Update heavy workload
- Workload B: Read mostly workload
- Workload C: Read only

### Workload A: Update heavy workload

This workload has a mix of 50/50 reads and writes. An application example is a session store recording recent actions. Updates in this workload do not presume you read the original record first. The assumption is all update writes contain fields for a record that already exists; oftentimes writing only a subset of the total fields for that record. Some data stores need to read the underlying record in order to reconcile what the final record should look like, but not all do.

### Workload B: Read mostly workload
This workload has a 95/5 reads/write mix. Application example: photo tagging; add a tag is an update, but most operations are to read tags. As with Workload A, these writes do not presume you read the original record before writing to it.

### Workload C: Read only

This workload is 100% read. Application example: user profile cache, where profiles are constructed elsewhere (e.g., Hadoop).

## Perform benchmarks in different configurations

An attempt was made to change the DBMS configuration as follows:

PostgreSQL:
- shared_buffers = 2GB
- effective_cache_size = 8GB
- max_wal_size = 4GB
- checkpoint_timeout = 30min
- max_parallel_workers_per_gather = 0

MySQL:
- innodb_buffer_pool_size=4GB
- innodb_log_file_size=4GB

However, changing these parameters had no effect.

## Analyze results
...

## Workload A: Update heavy workload

### Data load metrics
![Load metrics](indexed/report_output/report_workloada_load.png)

### Workload metrics
![Run metrics](indexed/report_output/report_workloada_run.png)

## Workload B: Read mostly workload

### Data load metrics
![Load metrics](indexed/report_output/report_workloadb_load.png)

### Workload metrics
![Run metrics](indexed/report_output/report_workloadb_run.png)

## Workload C: Read only

### Data load metrics
![Load metrics](indexed/report_output/report_workloadc_load.png)

### Workload metrics
![Run metrics](indexed/report_output/report_workloadc_run.png)

## Clean-Up

Remove images, volumes, etc.
```sh
docker compose down --rmi all -v --remove-orphans
```
