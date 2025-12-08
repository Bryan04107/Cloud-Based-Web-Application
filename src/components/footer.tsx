export default function Footer() {
  const studentName = 'Bryan Sujoso';
  const studentNumber = '22586532';
  const currentDate = new Date().toLocaleDateString('en-GB');

  return (
    <footer className="w-full text-center p-4 bg-footer">
      <p className="space-x-1">
        <span>Copyright © 2025 - {studentName} - {studentNumber}</span>
        <span className="hidden sm:inline"> - {currentDate}</span>
      </p>
     </footer>
  );
}