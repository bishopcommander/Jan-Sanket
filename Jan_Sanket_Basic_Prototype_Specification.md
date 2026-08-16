# Jan Sanket — Basic Prototype Specification

## 1. Prototype Goal

Build a working **basic prototype** of Jan Sanket, an AI-assisted civic issue reporting and resolution platform. The prototype should demonstrate the complete journey:

**Report → Understand → Route → Prioritize → Resolve → Verify**

The goal is not to build production-grade AI, government integrations, or large-scale infrastructure yet. The prototype should make the end-to-end workflow believable and easy to demonstrate.

---

## 2. Recommended Prototype Scope

Focus on these core features:

1. Citizen submits a civic complaint.
2. System collects photo, location and optional text/voice.
3. Prototype AI identifies the issue category.
4. Complaint receives a priority level.
5. Complaint is routed to the relevant department.
6. Citizen can track complaint status.
7. Admin/official can view, assign and update complaints.
8. Official uploads a resolution/before-after photo.
9. Citizen sees the resolution and can confirm/reject it.
10. Status updates and notifications are shown throughout the lifecycle.

Do not try to implement every advanced feature from the presentation in the first prototype.

---

# 3. Main User Roles

## A. Citizen / User

The citizen should be able to:

- Register/login.
- Open the home dashboard.
- Submit a new complaint.
- Capture/upload a photo.
- Use current GPS location or select a location manually.
- Add optional text description.
- Add optional voice description.
- See the AI-detected category.
- Submit the complaint.
- Receive a complaint/ticket ID.
- Track complaint status.
- View complaint history.
- View department/official updates.
- View before/after resolution evidence.
- Confirm that the issue is resolved.
- Reject/request re-check if the issue is not actually resolved.

### Citizen screens

- Login / Register
- Home Dashboard
- Report an Issue
- Complaint Submission
- Submission Success
- My Complaints
- Complaint Details / Tracking
- Notifications
- Profile / Settings

---

# 4. Admin / Government Official Portal

The admin portal is essential for demonstrating the government-side workflow.

Admin should be able to:

- Login through a separate admin interface.
- View all complaints.
- View complaints on a map.
- Filter by department.
- Filter by category.
- Filter by priority.
- Filter by status.
- Search complaints.
- Open complaint details.
- See citizen-submitted evidence.
- See GPS/location.
- See AI-detected category and confidence.
- Assign a complaint to an officer.
- Change complaint status.
- Add official remarks.
- Set/update SLA deadline.
- See overdue complaints.
- Escalate overdue complaints.
- Upload resolution/before-after evidence.
- Mark work as completed.
- View basic analytics.

### Admin screens

- Admin Login
- Admin Dashboard
- Complaint Management
- Complaint Details
- Map View
- Assignment Panel
- Resolution Verification
- Escalation / SLA View
- Basic Analytics

---

# 5. Complaint Lifecycle

Use a clear state machine:

**REPORTED**
↓
**AI ANALYZING**
↓
**CLASSIFIED**
↓
**ROUTED**
↓
**ASSIGNED**
↓
**IN PROGRESS**
↓
**RESOLUTION SUBMITTED**
↓
**CITIZEN VERIFICATION**
↓
**RESOLVED**

If the citizen rejects the resolution:

**CITIZEN VERIFICATION**
↓
**REOPENED**
↓
**IN PROGRESS**

If the SLA expires:

**IN PROGRESS**
↓
**SLA BREACHED**
↓
**ESCALATED**

---

# 6. Core Reporting Workflow

## Step 1 — Citizen opens Report Issue

Show one prominent **Report Issue** button.

## Step 2 — Evidence collection

Citizen can:

- Take/upload a photo.
- Allow GPS access.
- Enter a text description.
- Optionally record voice.

For the prototype, photo + GPS should be the minimum viable submission.

## Step 3 — AI Analysis

Prototype AI should analyze the available evidence.

Example:

Photo: pothole  
Text: "Large pothole near school"

Output:

- Category: Road / Pothole
- Severity: High
- Confidence: 92%

If implementing real computer vision is too much for the prototype, use a mock AI service or a simple classification model/API. The UI should still demonstrate the intended workflow.

## Step 4 — Location and Routing

Use GPS coordinates to determine the relevant ward/area.

Then route the complaint to a department.

Example:

**Category:** Pothole  
**Location:** Ward 12  
**Department:** Public Works Department

Other examples:

- Garbage → Sanitation Department
- Streetlight → Electrical Department
- Water leakage → Water Supply Department
- Road damage → Public Works Department

## Step 5 — Priority

Calculate a simple prototype priority score using:

- Severity
- Safety risk
- Number of duplicate reports
- Location importance
- Time pending

For the prototype, a simple weighted score is enough.

Example:

**Priority: HIGH**

## Step 6 — Complaint Created

Generate a unique complaint ID.

Example:

**JS-2026-001245**

Show:

> Your complaint has been successfully submitted.

Also show:

- Complaint ID
- Category
- Location
- Assigned department
- Priority
- Current status

---

# 7. Admin Workflow

Admin opens the dashboard and sees:

### Dashboard cards

- Total Complaints
- New
- In Progress
- Resolved
- SLA Breached

### Complaint table

Columns:

- Complaint ID
- Category
- Location
- Priority
- Department
- Status
- Assigned Officer
- SLA
- Created At

Admin can click a complaint to open its full details.

---

# 8. Complaint Detail Page

Show:

### Citizen Evidence

- Original photo
- Description
- Voice/transcript if available
- Location
- Timestamp

### AI Analysis

- Category
- Severity
- Confidence
- Detected keywords

### Routing

- Ward
- Department
- Assigned officer

### SLA

- Deadline
- Remaining time
- SLA status

### Timeline

Example:

**10:30 AM — Complaint submitted**  
**10:31 AM — AI classified as pothole**  
**10:31 AM — Routed to Public Works**  
**11:15 AM — Assigned to Officer A**  
**2:30 PM — Work started**  
**4:45 PM — Resolution submitted**  
**5:00 PM — Citizen verification requested**

---

# 9. Resolution Workflow

Officer/admin selects:

**Mark Work Completed**

Then uploads:

- After photo
- Completion remarks
- Completion location
- Completion timestamp

The complaint becomes:

**RESOLUTION SUBMITTED**

The citizen receives a notification:

> Your complaint has been marked as resolved. Please verify the work.

Citizen sees:

### Before

Original complaint photo.

### After

Official resolution photo.

Buttons:

**Confirm Resolution**

**Issue Still Exists**

If confirmed:

**RESOLVED**

If rejected:

**REOPENED**

---

# 10. SLA and Escalation Prototype

Keep the prototype simple.

Example:

Pothole:

- Acknowledgement: 4 hours
- Resolution target: 72 hours

If deadline passes:

**SLA BREACHED**

Admin dashboard shows a red/urgent flag.

Prototype escalation:

**Officer → Supervisor → Department Head**

You do not need a complicated automated government hierarchy in the first demo. A simulated/automatic escalation flag is enough.

---

# 11. Notifications

For the prototype, notifications can be implemented inside the application.

Show notifications for:

1. Complaint submitted.
2. Complaint classified.
3. Complaint assigned.
4. Work started.
5. Resolution submitted.
6. Citizen verification required.
7. Complaint resolved.
8. Complaint reopened.
9. SLA breached.

Real SMS/WhatsApp integration can be added later.

---

# 12. Duplicate Reports

For the prototype, demonstrate basic duplicate detection.

If multiple complaints are submitted:

- Same category
- Nearby location
- Similar time

Group them as one civic issue.

Example:

**Pothole Issue #P-102**

**47 citizen reports**

The dashboard should show the corroboration count.

A full DBSCAN/embedding pipeline is optional for the first prototype. A simple location-radius + category match is sufficient to demonstrate the concept.

---

# 13. Suggested MongoDB Collections

Use a simple MERN-friendly data model.

## Users

```text
_id
name
phone/email
role
createdAt
```

## Complaints

```text
_id
complaintId
userId
category
description
voiceTranscript
photoUrl
location
severity
priorityScore
priorityLevel
department
ward
status
assignedOfficer
slaDeadline
createdAt
updatedAt
```

## ComplaintTimeline

```text
complaintId
status
message
actor
timestamp
```

## Resolutions

```text
complaintId
beforePhotoUrl
afterPhotoUrl
remarks
location
submittedBy
submittedAt
citizenVerification
```

## Notifications

```text
userId
complaintId
title
message
read
createdAt
```

---

# 14. MERN Prototype Architecture

```text
                 CITIZEN
                    |
          React Web / Mobile UI
                    |
                    v
             Node.js + Express
                    |
       +------------+------------+
       |            |            |
       v            v            v
   Complaint      AI Mock      Routing /
   Service       Service       Priority
       |            |            |
       +------------+------------+
                    |
                    v
                MongoDB
                    |
          +---------+---------+
          |                   |
          v                   v
      Admin Portal        Notifications
```

For file storage:

```text
React
  |
  v
Node/Express
  |
  v
Cloudinary / Firebase Storage
  |
  v
Photo URL stored in MongoDB
```

---

# 15. Prototype Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Leaflet / React Leaflet for maps

## Backend

- Node.js
- Express.js
- JWT authentication
- REST APIs

## Database

- MongoDB
- Mongoose

## Image Storage

- Cloudinary or Firebase Storage

## AI

Prototype options:

- Mock classification service
- Simple image classification API
- Lightweight ML model

The architecture should keep AI behind a separate service/function so it can later be replaced with a stronger model.

## Maps

- Leaflet
- OpenStreetMap

## Deployment

Prototype:

- Frontend: Vercel
- Backend: Render / Railway
- Database: MongoDB Atlas
- Images: Cloudinary

---

# 16. APIs Needed for the Prototype

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Complaints

```text
POST /api/complaints
GET  /api/complaints
GET  /api/complaints/:id
PATCH /api/complaints/:id/status
PATCH /api/complaints/:id/assign
```

### AI

```text
POST /api/ai/classify
```

### Resolution

```text
POST /api/complaints/:id/resolution
POST /api/complaints/:id/verify
POST /api/complaints/:id/reopen
```

### Admin

```text
GET /api/admin/dashboard
GET /api/admin/complaints
GET /api/admin/analytics
```

### Notifications

```text
GET /api/notifications
PATCH /api/notifications/:id/read
```

---

# 17. What MUST Work in the Demo

Do not spend most of the hackathon trying to build advanced AI.

The demo should successfully show this complete scenario:

**Citizen takes pothole photo**
→ GPS captured
→ AI says "Pothole"
→ Priority becomes HIGH
→ Complaint goes to Public Works
→ Complaint ID generated
→ Admin sees it
→ Admin assigns officer
→ Officer marks "In Progress"
→ Citizen receives status update
→ Officer uploads after photo
→ Citizen sees before/after
→ Citizen confirms
→ Complaint becomes RESOLVED

This single end-to-end journey is more valuable than having 20 unfinished features.

---

# 18. Features for Later Production

Keep these as future architecture, not mandatory prototype work:

- Real multimodal AI
- Bhashini voice integration
- DBSCAN/embedding-based duplicate detection
- Kafka/SQS/RabbitMQ queues
- Redis caching
- Offline-first mobile application
- WhatsApp Business integration
- SMS gateway
- Advanced GIS jurisdiction engine
- Automatic SLA escalation
- Government department APIs
- Role-based government hierarchy
- Advanced analytics
- Production monitoring
- DPDP-compliant privacy lifecycle
- Large-scale load handling

---

# 19. Final Prototype Principle

**Build the workflow, not the entire government system.**

The prototype should prove that Jan Sanket can take a citizen's evidence, understand the issue, send it to the correct department, track the work, verify the resolution, and keep the citizen informed from beginning to end.

The strongest demo is therefore:

**One complaint → one complete journey → visible result.**
