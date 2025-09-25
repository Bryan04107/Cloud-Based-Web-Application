export default function AboutPage() {
  const studentName = 'Bryan Sujoso';
  const studentNumber = '22586532';

  return (
    <main className="container mx-auto px-4">
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto text-center bg-white p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-4">
          About This Project
        </h1>

        <div className="mb-8">
          <p>This web application is being built for the CSE3CWA/CSE5006 course at La Trobe University.</p>
          <p>This web application will be used as a tool that generates HTML and JavaScript content for deployment on the MOODLE LMS platform.</p>
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          How to Use This Website
        </h2>

        <div className="w-full max-w-lg aspect-video rounded-lg overflow-hidden shadow-lg mb-8">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Temporary Placeholder Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="mb-8 w-full pl-18 pr-18">
          <h2 className="text-2xl font-semibold mb-4">
            Features Implemented
          </h2>
          <ul className="list-disc list-inside text-left mx-auto space-y-2">
            <li>Basic pages for Tabs, Pre-lab Questions, Escape Room, and Coding Races.</li>
            <li>Functional About Page containing informational video regarding the applications funtionality.</li>
            <li>A responsive navigation menu with working links for each page.</li>
            <li>A fully functional sticky header and footer that appear on every page.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            My Details
          </h2>
          <p>Name: {studentName}</p>
          <p>Student ID: {studentNumber}</p>
        </div>
      </div>
    </main>
  );
}