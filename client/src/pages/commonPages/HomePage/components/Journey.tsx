import React from "react";

const Journey = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your English Journey?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of students who have improved their English skills with
          our platform
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="#"
            className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Create Free Account
          </a>
          <a
            href="#"
            className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition"
          >
            Take a Tour
          </a>
        </div>
      </div>
    </section>
  );
};

export default Journey;
