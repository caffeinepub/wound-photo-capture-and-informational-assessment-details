# Specification

## Summary
**Goal:** Enable users to capture/upload a wound photo, enter structured wound details, and receive an informational (non-diagnostic) report with saved history.

**Planned changes:**
- Add a photo capture/upload flow with preview and ability to retake/replace before submitting.
- Add a structured wound-details questionnaire and require acknowledgement of a medical disclaimer before submission.
- Generate a frontend-only informational “wound details” report from user inputs (summary, basic risk flags, general care guidance, and escalation advice when flags are present).
- Implement backend storage in a single Motoko actor for wound entries (image data/reference, content type, timestamp, responses, generated report) with create/list/fetch methods scoped to the caller.
- Add a History view that loads entries from the backend and allows viewing saved photo, inputs, and report.
- Apply a consistent health-oriented visual theme across screens (avoiding blue and purple as primary colors).
- Add clear safety and privacy text (not a diagnosis; photo storage note; avoid uploading personally identifying images).
- Add and use generated static assets (logo/app icon and hero/empty-state illustration) from `frontend/public/assets/generated`.

**User-visible outcome:** Users can take or upload a wound photo, fill out a guided form with a required disclaimer, view an informational report, and browse past submissions (including stored photos and reports) in a history section.
