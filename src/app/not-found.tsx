export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
      <a 
        href="/" 
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Return to BugTrail
      </a>
    </div>
  );
}
