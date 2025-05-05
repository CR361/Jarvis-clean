"use client";

import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignPage = pathname.startsWith("/contracts/sign");

  if (isSignPage) {
    // Geen layout op ondertekenpagina
    return <>{children}</>;
  }

  return (
    <>
      {/* HEADER */}
      <header className="w-full bg-gradient-to-r from-[#0f172a] to-[#1e293b] shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-start items-center p-4">
          <div className="text-8xl font-extrabold text-blue-400 tracking-[0.3em] drop-shadow-md">
            <span className="neon-logo">JARVIS</span>
          </div>

          <nav className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <a href="/dashboard" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </a>
            <a href="/customers" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
              <i className="fas fa-users"></i> Klanten
            </a>
            <a href="/invoices" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
              <i className="fas fa-file-invoice-dollar"></i> Facturen
            </a>
            <a href="/contracts" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
              <i className="fas fa-file-signature"></i> Contracten
            </a>
            <a href="/emails" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
              <i className="fas fa-envelope"></i> E-mails
            </a>
            <a href="/checklist" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
              <i className="fas fa-tasks"></i> Checklist
            </a>
            <a href="/contractors" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
              <i className="fas fa-hard-hat"></i> Aannemers
            </a>
            <a href="/backup" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
              <i className="fas fa-save"></i> Backup
            </a>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto p-6 flex-1">{children}</main>

      {/* FOOTER */}
      <footer className="w-full bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-center py-4 text-white mt-auto">
        <span>© {new Date().getFullYear()} JARVIS - All Rights Reserved</span>
      </footer>
    </>
  );
}
