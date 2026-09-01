-- Echo of Nomads voting — initial schema
-- Model: ONE contest, N participants, one public vote per identity.
-- Jury: whitelisted jurors score each participant 1..10; total = sum across jurors.
-- Nominations are intentionally NOT modelled (none exist in the current site).
-- To add them later: create `nomination`, add `nomination_id` to vote/jury_score,
-- and change vote's unique index to (voter_hash, nomination_id).

BEGIN;

CREATE TABLE participant (
  id            smallint PRIMARY KEY,
  slug          text UNIQUE NOT NULL,
  name          text NOT NULL,
  country       text NOT NULL,
  country_code  text NOT NULL,
  perform_no    smallint,
  active        boolean NOT NULL DEFAULT true,
  sort_order    smallint NOT NULL DEFAULT 0
);

CREATE TABLE vote (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  participant_id smallint NOT NULL REFERENCES participant(id),
  voter_hash     text NOT NULL,          -- sha256(google_sub + ':' + VOTE_PEPPER)
  auth_method    text NOT NULL DEFAULT 'google',
  ip_hash        text,                   -- sha256(ip + ':' + VOTE_PEPPER), abuse analysis only
  ua             text,
  geo_country    text,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX vote_one_per_voter ON vote (voter_hash);
CREATE INDEX vote_by_participant ON vote (participant_id);
CREATE INDEX vote_by_time ON vote (created_at);
CREATE INDEX vote_by_ip ON vote (ip_hash);

CREATE TABLE juror (
  id            smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         text UNIQUE NOT NULL,
  display_name  text NOT NULL,
  role          text NOT NULL DEFAULT 'member' CHECK (role IN ('chair','member')),
  active        boolean NOT NULL DEFAULT true
);

CREATE TABLE jury_score (
  juror_id       smallint NOT NULL REFERENCES juror(id),
  participant_id smallint NOT NULL REFERENCES participant(id),
  score          smallint NOT NULL CHECK (score BETWEEN 1 AND 10),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (juror_id, participant_id)
);

CREATE TABLE app_setting (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- voting window + kill switch; API falls back to env if this row is absent
INSERT INTO app_setting (key, value) VALUES
  ('voting_window', jsonb_build_object(
     'opensAt',  '2026-09-02T12:00:00+06:00',
     'closesAt', '2026-09-04T23:59:00+06:00',
     'frozen',   false
  ));

COMMIT;
