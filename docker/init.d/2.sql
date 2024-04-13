BEGIN;

CREATE TABLE birdhouses_history (
    id INT GENERATED ALWAYS AS IDENTITY,
    ubid UUID NOT NULL,
    eggs INT NOT NULL DEFAULT 0,
    birds INT NOT NULL DEFAULT 0,
    created_at timestamp without time zone NOT NULL DEFAULT now(),

    PRIMARY KEY(id),
    CONSTRAINT fk_birdhouse_ubid FOREIGN KEY(ubid) REFERENCES birdhouses(ubid) ON DELETE CASCADE
);

CREATE INDEX idx_birdhouse_history_ubid_created_at ON birdhouses_history (ubid, created_at DESC);

COMMIT;