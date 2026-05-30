# Real-Time Patient Input Form & Staff View Monitor
### Project Overview
This project is a Patient Information Form and Staff Monitoring Dashboard built with Next.js and Socket.IO.
The patient page allows users to enter and submit their information through a responsive form with client-side validation.
The staff dashboard receives and displays patient information in real time, including patient activity status such as Typing, Idle, and Submitted, allowing staff members to monitor form activity without refreshing the page.
### Setup Instructions
1.	Clone the repository
```bash
git clone <repository-url>
```
2.	Install dependencies
```bash
npm install
```
3.	Start the development server
Since this project uses a custom Socket.IO server (server.js), you must run the application using Node.js:
```bash
node server.js
```
This will:
- Start the Next.js application
- Start the Socket.IO server
- Enable real-time communication between patient and staff pages
4.	Open the application http://localhost:3000
<br /> Patient Form: http://localhost:3000
<br /> Staff Dashboard: http://localhost:3000/admin
### Bonus Features
- Real-time patient form synchronization using Socket.IO.
- Real-time patient activity tracking (Typing, Idle, and Submitted status).
- Responsive design optimized for desktop and mobile devices.
- Form validation for required fields, email format, and phone number format.
- Date picker for date of birth selection.
- Success toast notification displayed after form submission.
- Reusable UI components built with shadcn/ui.

## Development Planning documentation
### Project Structure
This structure keeps the application simple and separates patient-facing functionality from staff-facing functionality.
The application is organized into two main pages:
- app/page.js – Patient Information Form where patients enter and submit their information.
- app/admin/page.js – Staff monitoring page that displays patient information and activity status in real time.
Additional supporting files include:
- server.js – Custom Socket.IO server used for real-time communication between patient and staff pages.
- app/api/users/route.js – API endpoint used to receive submitted patient data.
- components/ui/* – Reusable UI components provided by shadcn/ui.
- public/ – Static assets used by the application.
###	Design Decisions (UI/UX)
**Patient Information Form:**
Related information is grouped together to improve readability, including: Personal Information, Contact Information and Emergency Contact Information
- **Desktop Layout**
<br /> On larger screens, Flexbox is used to arrange some related fields side by side to reduce excessive vertical scrolling and allows users to review information more efficiently.
- **Mobile Layout**
<br /> On smaller screens, the layout automatically switches to a single-column structure. Each field is displayed vertically to ensure better readability and easier interaction on smaller screens.

**Admin Dashboard:**
Related information is grouped together to improve readability, following the same approach used in the Patient Information Form.
- **Desktop Layout**
<br /> A two-column structure is used where the first column contains field labels and the second column contains patient values. This makes information easier to read.
-	**Mobile Layout**
<br /> The dashboard switches to a single-column layout on smaller screens. Each field is displayed above its corresponding value, improving readability and preventing content from becoming cramped on mobile devices.
### Component Architecture
The application consists of two primary pages:

**Patient Form Page**
<br /> Responsible for:
- Collecting patient information.
- Validating required fields.
- Sending real-time form updates through Socket.IO.
- Submitting completed forms to the API endpoint.

**Staff Admin Page**
<br /> Responsible for:
- Receiving real-time patient updates.
- Displaying live patient data.
- Showing activity status such as Typing, Idle, and Submitted.

**Shared UI Components**

The application uses shadcn/ui components including:
- Button
- Calendar
- Field
- Input
- Label
- Popover
- Radio Group
- Separator
- Sonner

These components provide a consistent user experience and reduce repetitive UI code.
### Real-Time Synchronization Flow
Patient Page

→ Socket.IO emit("patient-update")
<br />→ server.js
<br />→ io.emit("patient-live-data")
<br />→ Admin
<br />→ UI updates Instantly

The application uses Socket.IO to synchronize patient form updates with the staff dashboard in real time.
1.	When a patient enters information in the form, the client emits a patient-update event. 
2.	The Socket.IO server receives the updated form data. 
3.	The server broadcasts the data to all connected staff dashboards using the patient-live-data event. 
4.	The staff dashboard receives the event and updates its state.
5.	The UI re-renders automatically, allowing staff members to monitor form changes instantly without refreshing the page.

**For patient activity tracking:**

Patient Page

→ emit("patient-status")
<br />→ server.js
<br />→ io.emit("patient-live-status")
<br />→ Admin Page
<br />→ Update patient status
1.	The patient page emits a patient-status event when the user is typing, idle, or has submitted the form. 
2.	The server broadcasts the status through patient-live-status. 
3.	Connected staff dashboards update and display the latest patient status in real time.
