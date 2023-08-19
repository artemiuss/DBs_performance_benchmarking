DROP TABLE IF EXISTS usertable;
CREATE TABLE IF NOT EXISTS usertable(data JSONB);
CREATE UNIQUE INDEX IF NOT EXISTS usertable_data_idx ON usertable ((data->>'YCSB_KEY'));

TRUNCATE TABLE usertable;

SELECT * FROM usertable;
SELECT COUNT(*) FROM usertable;

SELECT data, (data->>'YCSB_KEY')
FROM usertable
WHERE data->>'YCSB_KEY'='user8517097267634966620'
;
