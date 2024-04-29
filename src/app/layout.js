import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ax2 Invoice Manager",
  description: "Invoice Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body className={inter.className}>
    <div className="flex min-h-svh h-auto">
      {/* Sidebar */}
      <div className="w-64 min-h-svh h-auto bg-blue-950 text-white">
        <div className="p-5">Invoice Manager</div>
        <ul className="mt-12">
          <Link href="/">
          <li className="p-4 hover:bg-blue-700 cursor-pointer">
              Dashboard
            </li></Link>
          <Link href="/CreateInvoice">
          <li className="p-4 hover:bg-blue-700 cursor-pointer">
              Create Invoice
            </li></Link>
          <Link href="/ViewInvoices">
            <li className="p-4 hover:bg-blue-700 cursor-pointer">
              View Invoices
            </li>
          </Link>
          <Link href="/Settings">
            <li className="p-4 hover:bg-blue-700 cursor-pointer">
              Settings
          </li>
          </Link>
        </ul>
      </div>
      {children}
    </div>
    </body>
    </html>
);
}
