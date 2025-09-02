export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
        <span>© {year} Majaz Parking</span>
        <div className="flex items-center gap-4">
          <a
            href="/parking"
            className="hover:underline text-gray-700"
          >
            Open Parking Demo
          </a>
          <a
            href="https://vercel.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            Powered by Vercel
          </a>
        </div>
      </div>
    </footer>
  );
}
