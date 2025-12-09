# Cloud-Based Web Application

A web application that creates HTML + JS to deploy on MOODLE LMS for the CSE3CWA/CSE5006 course.

## Tech Stack
- **Framework:** Next.js 15 (React)
- **Database:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS
- **Deployment:** Docker (Containerized)
- **Languages:** TypeScript
- **Serverless Functions (Lambda):** Utilizes Next.js API Routes (`/api/`) for dynamic HTML generation and backend logic which is architecturally equivalent to AWS Lambda functions.
- **Instrumentation:** Implemented via `src/instrumentation.ts` hook for server lifecycle monitoring.


## Current Features Implemented

### **Core UI/UX**
1. **Responsive Design:** Functional Navigation Bar, Header, Footer, and Hamburger Menu.
2. **Theming:** 6 selectable themes (including a system theme detection).
3. **State Persistence:** Cookies used for Navigated Tabs, User Themes, and Tab Content.
4. **Feedback:** Custom Skeletal Placeholder Cards, Loading screens, and 404 Not Found pages.

### **Tabs Page**
1. **Dynamic Content:** Up to 15 Tabs Header, each with customizable names and content.
2. **Output:** Generates a standalone HTML file containing the tabs name and content.
3. **Guide:** Walkthrough Video attached to the About Page.

### **Escape Room Builder (Advanced)**
1. **CRUD Operations:** Create, Read, Update, and Delete escape rooms using a local SQLite database and Prisma ORM.
2. **Visual Editor:** Drag-and-drop hotspots on background images.
3. **Question Types:** Supports Single/Multiple Choice Questions, Essay/Code Questions, and Guide hotspots.
4. **Custom Assets:** Custom-made SVGs for Game Icons (Lock, SCQ and MCQ, Code, Guide.).
5. **Game Logic:** Functional Timer, Penalty system, Win/Loss states, and Hotspots states (Locked/Hidden).
6. **Data Management:** Search, Sort, and Bulk Seeding (Random Generation) for stress testing.
7. **Output:** Generates a standalone HTML file containing the full escape room game.


## How to Run with Docker

1.  **Build the Image:**
```bash
docker build -t cloud-based-web-app .
```


2.  **Run the Container:**
```bash
docker run --rm -p 3000:3000 cloud-based-web-app
```


3.  **Open the App:**  
Navigate to [http://localhost:3000](http://localhost:3000)


4.  **Add Data (Optional):**  
*The app automatically seeds a sample room on startup but you can populate the database with simulated escape room using these commands:*
   Get the `<CONTAINER_ID>`:
```bash
docker ps
```
   Seed a fixed sample escape room:
```bash
docker exec -it <CONTAINER_ID> npm run seed:set
```
   Seed 10 random escape rooms:
```bash
docker exec -it <CONTAINER_ID> npm run seed:random
```
   Seed a specified number (above 1) of random escape rooms (e.g. 50):
```bash
docker exec -it <CONTAINER_ID> npm run seed:random --50
```


## How to Run Locally

1. **Install dependencies:**
```bash
npx playwright install
```


2. **Execute the Tests:**  
*Creates the local SQLite file from the Prisma schema.*
```bash
npx prisma db push
```


4. **Seed the Database (Optional):**  
*You can populate the database with simulated escape room using these commands:*
   Seed a fixed sample escape room:
```bash
npm run seed:set
```
   Seed 10 random escape rooms:
```bash
npm run seed:random
```
   Seed a specified number (above 1) of random escape rooms (e.g. 50):
```bash
npm run seed:random -- 50
```


5. **Run the development server:**
```bash
npm run dev
```


6. **Check the page result:**  
Navigate to [http://localhost:3000](http://localhost:3000)


## How to Run Playwright Tests
*Ensure the server is running before starting the test.*

1. **Install dependencies:**
```bash
npx playwright install
```


2. **Execute the Tests:**  
*Tests to verify room creation (title and image upload), game elements (hotspots, timer, and score), and state transitions.*
```bash
npx playwright test
```