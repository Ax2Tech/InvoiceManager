export default function Home() {
  return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 h-full bg-blue-800 text-white">
          <div className="p-5">Invoice Manager</div>
          <ul className="mt-12">
            <li className="p-4 hover:bg-blue-700 cursor-pointer">Dashboard</li>
            <li className="p-4 hover:bg-blue-700 cursor-pointer">Create Invoice</li>
            <li className="p-4 hover:bg-blue-700 cursor-pointer">View Invoices</li>
            <li className="p-4 hover:bg-blue-700 cursor-pointer">Settings</li>
          </ul>
        </div>
        {/* Main content area */}
        <main className="flex-1 p-8">
          <h1 className="font-semibold text-xl">Welcome to Your Invoice Manager</h1>
          <p className="mt-4 text-gray-600">
            Here you can manage your invoices: create new ones, view past invoices, and analyze your financial data.
          </p>
        </main>
      </div>
  );
}

