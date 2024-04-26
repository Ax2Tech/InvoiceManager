import Link from "next/link";

export default function Home() {
  return (
        <main className="flex-1 p-8">
          <h1 className="font-semibold text-xl">Welcome to Your Invoice Manager</h1>
          <p className="mt-4 text-gray-600">
            Here you can manage your invoices: create new ones, view past invoices, and analyze your financial data.
          </p>
        </main>
  );
}

