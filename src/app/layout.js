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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 h-full bg-blue-950 text-white">
        <div className="p-5">Invoice Manager</div>
        <ul className="mt-12">
          <li className="p-4 hover:bg-blue-700 cursor-pointer">
            <Link href="/">
              Dashboard
            </Link></li>
          <li className="p-4 hover:bg-blue-700 cursor-pointer">
            <Link href="/CreateInvoice">
              Create Invoice
            </Link></li>
          <li className="p-4 hover:bg-blue-700 cursor-pointer">
            <Link href="/ViewInvoices">
              View Invoices
            </Link>
          </li>
          <li className="p-4 hover:bg-blue-700 cursor-pointer">
            <Link href="/Settings">
              Settings
            </Link>
          </li>
        </ul>
      </div>
      {children}
    </div>
    </body>
    </html>
);
}
