const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 md:py-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Master English Faster &amp; Smarter
          </h1>
          <p className="text-xl mb-8">
            Interactive lessons, personalized feedback, and AI-powered tools to
            help you achieve fluency.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="#"
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-100 transition"
            >
              Start Learning Free
            </a>
            <a
              href="#"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-white hover:bg-opacity-10 transition"
            >
              Explore Features
            </a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="bg-card text-card-foreground rounded-xl shadow-2xl p-6 text-dark">
              <h3 className="font-bold text-xl mb-4">
                Experience a Demo Lesson
              </h3>
              <div className="flex space-x-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-accent-error" />
                <span className="w-3 h-3 rounded-full bg-accent-warn" />
                <span className="w-3 h-3 rounded-full bg-accent-success" />
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="mb-2">
                  <b>Interactive Exercise:</b> Fill in the blank
                </p>
                <p className="italic">"She _____ to the market every day."</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button className="bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
                    go
                  </button>
                  <button className="bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
                    went
                  </button>
                  <button className="bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
                    goes
                  </button>
                  <button className="bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
                    going
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Try our interactive exercises without signing up!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
