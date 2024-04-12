CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

BEGIN;
CREATE TABLE houses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ubid UUID DEFAULT uuid_generate_v4() NOT NULL,
    name VARCHAR(16) NOT NULL,
    longitude float NOT NULL,
    latitude float NOT NULL    
);

CREATE INDEX idx_ubid ON houses (ubid);
COMMIT;