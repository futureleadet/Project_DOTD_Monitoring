
-- Add new columns for expanded generation options
ALTER TABLE creations ADD COLUMN IF NOT EXISTS height INTEGER;
ALTER TABLE creations ADD COLUMN IF NOT EXISTS body_type VARCHAR(50);
ALTER TABLE creations ADD COLUMN IF NOT EXISTS style VARCHAR(50);
ALTER TABLE creations ADD COLUMN IF NOT EXISTS colors VARCHAR(255);
