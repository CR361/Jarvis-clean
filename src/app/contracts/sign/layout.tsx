export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center">
      <header className="sign-header bg-blue-600 text-white p-4 w-full">
        <h1 className="text-3xl font-bold text-center">Contract Ondertekenen</h1>
      </header>
      <main className="sign-main flex flex-col items-center justify-center p-6 w-full max-w-2xl">
        {children}
      </main>
      <footer className="sign-footer bg-blue-600 text-white text-center py-4 mt-6 w-full">
        <span>© {new Date().getFullYear()} JARVIS - All Rights Reserved</span>
      </footer>
    </div>
  );
}

