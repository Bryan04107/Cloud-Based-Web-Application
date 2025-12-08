# Cloud-Based Web Application

A web application that creates HTML + JS to deploy on MOODLE LMS for the CSE3CWA/CSE5006 course.
This will is the first part of a larger project.

## Current Features Implemented

1. About Page.
2. Functional Navigation Bar.
3. Functional Header and Footer.
4. Linked placeholder pages.
5. Cookies for navigated Tabs, User Themes and Tabs Content and Header.
6. Functional hamburger menu.
7. Five themes implemented to choose from (detects user system theme).
9. Up to 15 Tabs Header each with modifiable name.
9. Customizable inputs for Tabs Header and Content.
10. Tabs Page with functional HTML output.
11. Simple Walkthrough Video attached to About Page on how to use Tabs Page.
12. Added Loading and Not Found Page.
13. Escape Room Page Frontend.
14. Functional Escape Room Timer.
15. Functional Escape Room HTML Output.
16. Custom made SVGs for Icons in the Escape Room.
17. Allows Multiple Different Question Type (Multiple Choice, Code Correction, and Info/Guide hotspots).
18. Escape Room Page CRUD Backend and Local SQLite database and Prisma ORM.
19. Skeletal Cards for Placeholder during Escape Room Database Retrieval Loading Duration.
20. Search and Sort for Escape Rooms.
21. Seeding for Singular/Bulk Escape Rooms.

## How to Run Locally

1. **Clone the repository:**
```bash
git clone https://github.com/Bryan04107/Cloud-Based-Web-Application/
```
2. **Install dependencies:**
```bash
npm install
```
3. **Initialize the Database:**
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