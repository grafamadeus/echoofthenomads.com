-- Jury phase 2: score each participant separately per category (ethno-hit / world-hit).
-- jury_score in 001 had no category; it is empty at this point, so recreate it.

BEGIN;

DROP TABLE IF EXISTS jury_score;

CREATE TABLE jury_score (
  juror_id       smallint     NOT NULL REFERENCES juror(id) ON DELETE CASCADE,
  participant_id smallint     NOT NULL REFERENCES participant(id),
  category       text         NOT NULL CHECK (category IN ('ethno','world')),
  score          smallint     NOT NULL CHECK (score BETWEEN 1 AND 10),
  updated_at     timestamptz  NOT NULL DEFAULT now(),
  PRIMARY KEY (juror_id, participant_id, category)
);
CREATE INDEX jury_score_by_participant ON jury_score (participant_id, category);

-- jury.open  = master on/off for scoring
-- jury.category = which category the panel is scoring right now (admin flips it)
INSERT INTO app_setting (key, value)
VALUES ('jury', jsonb_build_object('open', true, 'category', 'ethno'))
ON CONFLICT (key) DO NOTHING;

COMMIT;
