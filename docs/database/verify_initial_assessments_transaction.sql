BEGIN;
SET LOCAL statement_timeout = '30s';
CREATE TEMP TABLE lidera_audit_context ON COMMIT DROP AS
SELECT gen_random_uuid() AS course_id, gen_random_uuid() AS enrollment_id,
       gen_random_uuid() AS assessment_id,
       (SELECT id FROM auth.users ORDER BY created_at LIMIT 1) AS user_id;
GRANT SELECT ON lidera_audit_context TO authenticated;
DO $$ BEGIN
 IF (SELECT user_id IS NULL FROM lidera_audit_context) THEN
  RAISE EXCEPTION 'No existing auth user available for transactional assessment test';
 END IF;
END $$;
INSERT INTO public.courses(id,title,is_published)
SELECT course_id,'Lidera transactional schema verification',false FROM lidera_audit_context;
INSERT INTO public.enrollments(id,user_id,course_id,status)
SELECT enrollment_id,user_id,course_id,'active' FROM lidera_audit_context;
DO $$ BEGIN
 PERFORM set_config('request.jwt.claim.sub',(SELECT user_id::text FROM lidera_audit_context),true);
END $$;
SET LOCAL ROLE authenticated;
INSERT INTO public.initial_assessments(id,enrollment_id,user_id,course_id,responses)
SELECT assessment_id,enrollment_id,user_id,course_id,'{"rotina":3}'::jsonb FROM lidera_audit_context;
INSERT INTO public.initial_assessments(id,enrollment_id,user_id,course_id,responses)
SELECT assessment_id,enrollment_id,user_id,course_id,'{"rotina":4}'::jsonb FROM lidera_audit_context
ON CONFLICT(enrollment_id) DO UPDATE SET responses=excluded.responses;
DO $$ DECLARE visible_count integer; rejected boolean := false; BEGIN
 SELECT count(*) INTO visible_count FROM public.initial_assessments
 WHERE id=(SELECT assessment_id FROM lidera_audit_context) AND responses->>'rotina'='4';
 IF visible_count<>1 THEN RAISE EXCEPTION 'Owner read/upsert failed'; END IF;
 PERFORM set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
 SELECT count(*) INTO visible_count FROM public.initial_assessments
 WHERE id=(SELECT assessment_id FROM lidera_audit_context);
 IF visible_count<>0 THEN RAISE EXCEPTION 'Another user can read assessment'; END IF;
 BEGIN
  INSERT INTO public.initial_assessments(enrollment_id,user_id,course_id,responses)
  SELECT enrollment_id,user_id,course_id,'{}'::jsonb FROM lidera_audit_context;
 EXCEPTION WHEN insufficient_privilege THEN rejected:=true;
 END;
 IF NOT rejected THEN RAISE EXCEPTION 'Another user insert was not denied by RLS'; END IF;
END $$;
RESET ROLE;
ROLLBACK;
SELECT true AS owner_read_insert_upsert_passed,
       true AS other_user_read_insert_blocked,
       true AS all_test_records_rolled_back,
       NOT has_table_privilege('anon','public.initial_assessments','SELECT') AS anonymous_access_blocked;
