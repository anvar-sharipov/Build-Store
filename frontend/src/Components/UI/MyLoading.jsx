import React from "react";

const MyLoading = () => {
  return (
    <div className="py-10 space-x-2 fixed inset-0 flex items-center justify-center z-50 bg-gray-400/50 dark:bg-gray-600/20">
      {[0, 0.15, 0.3].map((d, i) => (
        <div
          key={i}
          className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
          style={{
            animation: `bounce 1s ${d}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default MyLoading;
