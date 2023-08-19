DROP TABLE IF EXISTS test.usertable;

CREATE TABLE test.usertable (
  data json,
  ycsb_key varchar(255) GENERATED ALWAYS AS (JSON_EXTRACT(data, '$.YCSB_KEY')) STORED PRIMARY KEY
);

CREATE TABLE test.usertable(
  data json,
  UNIQUE INDEX ycsb_key ((JSON_VALUE(data, '$.YCSB_KEY' RETURNING char(255))))
);

TRUNCATE TABLE test.usertable;

SELECT * FROM test.usertable;
SELECT COUNT(*) FROM test.usertable;

SELECT DATA, JSON_VALUE(data, '$.YCSB_KEY' RETURNING char(255)) FROM test.usertable
WHERE ycsb_key = '"user1000385178204227360"'
;

SELECT DATA
FROM test.usertable
WHERE JSON_VALUE(data, '$.YCSB_KEY' RETURNING char(255)) = 'user6284781860667377211';
