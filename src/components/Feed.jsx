import React from "react";

const Feed = () => {
  return (
    <div className="bg-gray-50" style={{ height: "calc(100vh - 128px)" }}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Feed</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Post Title</h2>
            <p className="text-gray-600">This is a sample post content.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Another Post</h2>
            <p className="text-gray-600">More sample content here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
