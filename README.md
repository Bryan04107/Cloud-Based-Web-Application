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

## How to Run Locally

1. Clone the repository.
2. Install dependencies with `npm install`.
3.  Initialize the Database with `npx prisma db push`.
4. Run the development server with `npm run dev`.
5. Check the page result at http://localhost:3000.