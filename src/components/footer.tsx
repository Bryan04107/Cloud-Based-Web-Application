export default function Footer() {
  const studentName = 'Bryan Sujoso';
  const studentNumber = '22586532';
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <footer className="w-full text-center p-4 bg-gray-800 text-white">
      <p className="space-x-1">Copyright, {studentName}, {studentNumber}, {currentDate}</p>
    </footer>
  );
}