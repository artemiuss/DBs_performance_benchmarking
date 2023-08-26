DROP TABLE IF EXISTS test.usertable;
CREATE TABLE test.usertable (
    data json,
    ycsb_key varchar(255) GENERATED ALWAYS AS (JSON_EXTRACT(data, '$.YCSB_KEY')) /*VIRTUAL*/STORED PRIMARY KEY
);

