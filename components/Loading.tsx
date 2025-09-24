import React from "react";

export default function Loading() {
  return (
    <body className="flex min-h-screen">
      <aside className="w-64 bg-white p-6 shadow-xl hidden md:block rounded-r-3xl">
        <div className="h-full flex flex-col space-y-8">
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-green-300"></div>
            <div className="h-6 bg-gray-300 w-32 rounded-full"></div>
          </div>

          <nav className="flex-1 space-y-4">
            <div className="flex items-center space-x-3 animate-pulse">
              <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              <div className="h-4 bg-gray-300 w-24 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-3 animate-pulse">
              <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              <div className="h-4 bg-gray-300 w-28 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-3 animate-pulse">
              <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              <div className="h-4 bg-gray-300 w-20 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-3 animate-pulse">
              <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              <div className="h-4 bg-gray-300 w-24 rounded-full"></div>
            </div>
          </nav>

          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 w-full rounded-lg"></div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 flex flex-col">
        <header className="h-16 w-full bg-white shadow-md rounded-2xl animate-pulse">
          <div className="flex items-center h-full p-4 space-x-4">
            <div className="h-8 bg-gray-200 w-48 rounded-full"></div>
            <div className="flex-1"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 animate-pulse">
          <div className="h-8 w-64 bg-gray-300 rounded-full"></div>
          <div className="flex space-x-4">
            <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="bg-white p-6 shadow-md rounded-2xl animate-pulse">
            <div className="h-6 w-2/3 bg-gray-200 rounded-full mb-3"></div>
            <div className="h-10 w-1/2 bg-gray-300 rounded-full"></div>
          </div>

          <div className="bg-white p-6 shadow-md rounded-2xl animate-pulse">
            <div className="h-6 w-2/3 bg-gray-200 rounded-full mb-3"></div>
            <div className="h-10 w-1/2 bg-gray-300 rounded-full"></div>
          </div>

          <div className="bg-white p-6 shadow-md rounded-2xl animate-pulse">
            <div className="h-6 w-2/3 bg-gray-200 rounded-full mb-3"></div>
            <div className="h-10 w-1/2 bg-gray-300 rounded-full"></div>
          </div>

          <div className="bg-white p-6 shadow-md rounded-2xl animate-pulse">
            <div className="h-6 w-2/3 bg-gray-200 rounded-full mb-3"></div>
            <div className="h-10 w-1/2 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        <div className="w-full bg-white p-6 shadow-md rounded-2xl animate-pulse">
          <div className="h-8 w-48 bg-gray-300 rounded-full mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </main>
    </body>
  );
}
