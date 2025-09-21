export default function AboutPage() {
  const studentName = 'Bryan Sujoso';
  const studentNumber = '22586532';

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <main className="flex flex-col items-center justify-center w-full flex-1 text-center">
        <h1 className="text-4xl font-bold mb-4">
          About Page
        </h1>

        <div className="mb-4">
          <p>Name: {studentName}</p>
          <p>Student ID: {studentNumber}</p>
        </div>

        <h2 className="text-2xl font-semibold mt-4 mb-4">
          How to Use This Website:
        </h2>
        <div className="w-full max-w-lg aspect-video bg-gray-300 flex items-center justify-center text-gray-700 rounded-lg shadow-lg">
          <p>Temp Placeholder</p>
        </div>
      </main>
    </div>
  );
}