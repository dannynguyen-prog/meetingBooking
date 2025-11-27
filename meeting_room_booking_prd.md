# Multi-Tenant Meeting Room Booking Platform

## 1. Overview
A multi-tenant meeting room booking system designed for companies that need a centralized platform to manage their meeting rooms, employee access, and booking workflows (Web + Mobile). This document serves as the Product Requirements Document (PRD) for the POC phase.

---

## 2. Goals & Non-Goals
### **2.1 Goals**
- Provide a functional POC demonstrating the end-to-end booking workflow.
- Support multi-tenant architecture (multiple companies isolated within the same platform).
- Support basic user roles: System Admin, Company Admin, Employee.
- Provide basic UI for Web (Admin) and Mobile (Employee), with booking actions limited to mobile in the POC.
- Support invitations and signup flows, including the ability to resend expired invitations.

### **2.2 Non-Goals (for POC)**
- Advanced permission management.
- Meeting conflict resolution beyond basic checking.
- Integration with external calendars (Google/Microsoft).
- Guest acceptance workflow.
- Billing management.

---

## 3. User Roles & Permissions
### **3.1 System Admin**
- Create/edit/disable companies.
- Create/edit/disable company admins associated with a company.
- Resend invitation emails to Company Admin.
- View dashboard metrics (total companies onboarded, active/inactive counts, pending invites) to monitor platform health.

### **3.2 Company Admin**
- Finish signup via invitation.
- Manage meeting rooms (CRUD).
- Manage company employees (invite, view list, activate/deactivate employees).
- View company-level room utilization reports over a selected time range (future scope, defined for clarity).

### **3.3 Employee (Mobile)**
- Finish signup via invitation.
- View dashboard with upcoming meetings.
- Create meeting events.
- Select available rooms.
- Add internal guests.
- View calendar (day/week/month).
- Edit/cancel meetings they created (with notifications to invitees).

---

## 4. Use Cases & Flows

### **4.1 System Admin Web Flows**
#### **4.1.1 Create Company + Company Admin**
- Input: company name, logo, address, industry, status.
- Add Company Admin: email.
- System sends invitation email (link valid for 48 hours).

#### **4.1.2 Manage Companies**
- View list of companies.
- Edit company profile.
- Set company status active/inactive.

#### **4.1.3 Manage Company Admins**
- View list of company admins for a given company.
- Create/edit/delete company admins.
- Activate/deactivate company admins.
- Resend invitation email when the previous token expired and signup is incomplete.

---

### **4.2 Company Admin Web Flows**
#### **4.2.1 Signup via Invitation**
- User clicks email link.
- Redirect to signup form.
- Enter first name, last name, password.

#### **4.2.2 Manage Meeting Rooms (CRUD)**
Fields:
- RoomID (auto-generated)
- Name
- Capacity
- Available time (from/to)
- Location
- Images
- Status (active/inactive)

#### **4.2.3 Manage Employees**
- Invite employees (input email → triggers email with mobile signup link).
- Activate/deactivate existing employees.
- Track invitation status to know when resends are needed.

---

### **4.3 Employee Mobile Flows**
#### **4.3.1 Signup via Invitation**
- Click email link.
- If app not installed → store download.
- After install → link opens app.
- User enters first name, last name, password.

#### **4.3.2 Dashboard (Home Screen)**
- Upcoming Meetings list.
- "Book a Meeting" button.
- Calendar widget (day/week/month view).

#### **4.3.3 Book a Meeting**
Inputs:
- Meeting title.
- Start time, end time (aligned to the meeting room’s local timezone).
- Meeting details (optional).
- Add guests (from employee directory).
- Choose meeting room (system filters available rooms automatically).

System actions:
- Save meeting.
- Add to employee’s in-app calendar.
- Send invitation emails to all guests.

#### **4.3.4 Edit / Cancel Meeting**
- Meeting owner can edit or cancel bookings via mobile.
- System updates the booking, recalculates room availability, records audit entries, and sends updated/cancellation emails to all invitees.

#### **4.3.5 View Calendar**
- View personal meetings.
- Day/Week/Month switching.
- Tap on meeting → detail view.

---

## 5. System Logic

### **5.1 Meeting Room Availability Logic**
- A room is available if no existing meeting overlaps with selected time.
- System filters rooms dynamically when time is selected.
- User-provided start/end times are converted to the room’s timezone before availability checks.
- Recurring bookings are out of scope for the POC but may be revisited later.

### **5.2 Invitation Link Expiration**
- All invitations valid for 48 hours.
- Resending an invitation issues a new token only when the previous token has expired and the user has not completed signup.

### **5.3 Company & User Status Handling**
- If company is deactivated → all user logins disabled.
- If Company Admin or Employee is inactive → login blocked.
- Each user record tracks `last_login_at` for audit purposes.

### **5.4 Audit Logging**
- All CRUD actions on Companies, Company Admins, Employees, Meeting Rooms, Meetings, and invitations produce audit log entries (actor, timestamp, entity, action, metadata).

---

## 6. Data Model (POC Level)

### **6.1 Company**
- id
- name
- logo_url
- address
- industry
- status

### **6.2 CompanyAdmin**
- id
- company_id
- first_name
- last_name
- email
- password_hash
- status
- last_login_at

### **6.3 Employee**
- id
- company_id
- first_name
- last_name
- email
- password_hash
- status
- last_login_at

### **6.4 MeetingRoom**
- id
- company_id
- name
- capacity
- available_from
- available_to
- location
- images
- status

### **6.5 Meeting**
- id
- created_by_employee_id
- title
- start_time
- end_time
- details
- room_id

### **6.6 MeetingGuests**
- meeting_id
- employee_id

### **6.7 AuditLog**
- id
- actor_user_id
- actor_role
- entity_type
- entity_id
- action
- metadata (JSON, optional)
- created_at

---

## 7. UI Flow Diagrams (Wireframe-Spec-Level)
### **7.1 System Admin Web**
- Login → Dashboard (total onboarded companies, status filters, pending invites) → Companies → Create Company → Add Company Admin → Send Invitation → Manage Company Admins.

### **7.2 Company Admin Web**
- Signup → Login → Dashboard → Rooms Management → Employee Management.

### **7.3 Employee Mobile**
- Signup → Dashboard → Book Meeting → Select Time → Select Guests → Select Room → Save → Meeting List → Edit/Cancel Meeting.

*(Detailed diagrams prepared separately.)*

---

## 8. Technical Architecture (POC Scope)
### **8.1 Backend**
- REST API or GraphQL.
- Services:
  - Auth Service
  - Company Service
  - User Service
  - Meeting Room Service
  - Meeting Service

### **8.2 Frontend**
- Web: React or Next.js.
- Mobile: Flutter or React Native.

### **8.3 Database**
- PostgreSQL / MySQL.
- Multi-tenant via company_id scoping.

### **8.4 Authentication**
- JWT.
- Email-based invitation with branded templates for System Admin, Company Admin, and Employee flows (POC deliverable).

---

## 9. Non-Functional Requirements
- SLA not required for POC.
- Should support thousands of users (future scalability considered).
- Basic security: hashed passwords, invitation token expiry, and JWT.
- Audit logging for all key entities and actions.
- Track `last_login_at` per user for operational visibility.

---

## 10. Open Questions
- Should meeting reminders be included?

---

## 11. POC Deliverables
- Web Admin Interface (System Admin + Company Admin).
- Mobile App (Employee).
- Email invitation system with baseline templates (System Admin, Company Admin, Employee).
- Full booking flow.
- Audit logging and last-login tracking.

---

End of Document.

