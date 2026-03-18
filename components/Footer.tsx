export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200 py-12 text-center">
      <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
        As an Amazon Associate, I earn from qualifying purchases. All
        recommendations are products I have personally purchased and used.
      </p>
      <p className="mt-4 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Justin&apos;s Favorite Things
      </p>
    </footer>
  );
}
