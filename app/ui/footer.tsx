export default function Footer() {
  return (
    <footer className="mt-10 bg-transparent px-4 py-6 text-sm text-base-content/70 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
        <p>© {new Date().getFullYear()} Vahala</p>
        <p className="text-center">
          Weather insights for better trail decisions.
        </p>
      </div>
    </footer>
  );
}
