--COMMAND:  psql    --host=spotty.cgszne64zlop.us-west-2.rds.amazonaws.com    --port=5432    --username alex    --dbname=spotty

CREATE TABLE HistoryAlex (
  index SERIAL NOT NULL PRIMARY KEY,
  track_id character varying(45),
  track_name character varying(255),
  duration_ms integer,
  played_at timestamp
);
