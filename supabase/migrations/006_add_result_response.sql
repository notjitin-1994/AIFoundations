-- Add result_response to xapi_statements to track open-ended learner responses
ALTER TABLE xapi_statements ADD COLUMN result_response TEXT;
