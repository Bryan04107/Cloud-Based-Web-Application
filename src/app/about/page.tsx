export default function AboutPage() {
  const studentName = 'Bryan Sujoso';
  const studentNumber = '22586532';

  return (
    <main className="container mx-0 sm:mx-auto px-0 sm:px-4">
      <div className="flex flex-col items-center w-full max-w-4xl mx-0 sm:mx-auto p-8 text-center bg-background shadow-primary shadow-sm">
        <h1 className="text-4xl font-bold mb-4">
          About This Project
        </h1>

        <div className="mb-8">
          <p>This web application is being built for the CSE3CWA/CSE5006 course at La Trobe University.</p>
          <p>This web application will be used as a tool that generates HTML and JavaScript content for deployment on the MOODLE LMS platform.</p>
        </div>

        <h2 className="text-2xl font-semibold mb-2" id="how-to-use-heading">
          How to Use This Website
        </h2>

        <div role="region" aria-labelledby="how-to-use-heading" className="min-w-full max-w-lg aspect-video rounded-lg overflow-hidden shadow-lg px-8 mb-8">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/BALWMaydv_E"
            title="Temporary Placeholder Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="mb-8 w-full px-0 sm:px-18">
          <h2 className="text-2xl font-semibold mb-4" id="features-heading">
            Features Implemented
          </h2>
          <ul role="list" aria-labelledby="features-heading" className="list-disc list-inside text-left mx-auto space-y-2">
            <li>Basic pages for Tabs, Pre-lab Questions, Escape Room, and Coding Races.</li>
            <li>Functional About Page containing informational video regarding the applications funtionality.</li>
            <li>A responsive navigation menu with working links for each page.</li>
            <li>A fully functional sticky header and footer that appear on every page.</li>
            <li>Cookies!</li>
            <li>Funcitonal hamburger menu.</li>
            <li>Multiple selection of themes.</li>
            <li>Tabs Header to create, edit (accompanied with simple text editor tools), and delete headers.</li>
            <li>Tabs Content to edit the content of the tab (accompanied with simple text editor tools).</li>
            <li>Tabs Output to create an HTML pastable/downloadable code of the tabs header along with their associated content.</li>
            <li>Phone Flexing.</li>
            <li>Fully functional Escape Room page with custom icons and working timer.</li>
          </ul>
        </div>

        <div role="region" aria-labelledby="my-details-heading">
          <h2 className="text-2xl font-semibold mb-2" id="my-details-heading">
            My Details
          </h2>
          <p>Name: {studentName}</p>
          <p>Student ID: {studentNumber}</p>
        </div>
      </div>
    </main>
  );
}