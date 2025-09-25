export default function Footer() {
  const studentName = 'Bryan Sujoso';
  const studentNumber = '22586532';
  const currentDate = new Date().toLocaleDateString('en-GB');

  return (
    <footer className="w-full text-center p-4 bg-zinc-200 text-zinc-800">
      <p className="space-x-1">
        Copyright © 2025 - {studentName} - {studentNumber} - {currentDate}
      </p>
    </footer>
  );
}