DROP TABLE IF EXISTS usertable;
CREATE TABLE IF NOT EXISTS usertable(data JSONB);
CREATE UNIQUE INDEX IF NOT EXISTS usertable_data_idx ON usertable ((data->>'YCSB_KEY'));
