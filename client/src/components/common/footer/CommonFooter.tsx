const CommonFooter = () => {
  return (
    <footer className="bg-dark bg-card border-t border-t-border  ">
      <div className="container mx-auto px-4">
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">
                  <i className="fas fa-language mr-2" />
                  LinguaLearn
                </h3>
                <p className="text-gray-400">
                  The smart way to master English with interactive lessons and
                  AI-powered feedback.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Features</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Interactive Lessons
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Speaking Practice
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Progress Tracking
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Gamification
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    <i className="fab fa-twitter" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    <i className="fab fa-instagram" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    <i className="fab fa-linkedin-in" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    <i className="fab fa-youtube" />
                  </a>
                </div>
                <div className="mt-6">
                  <p className="text-gray-400 mb-2">Download our mobile app</p>
                  <div className="flex space-x-2">
                    <a
                      href="#"
                      className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded flex items-center"
                    >
                      <i className="fab fa-apple mr-2" /> iOS
                    </a>
                    <a
                      href="#"
                      className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded flex items-center"
                    >
                      <i className="fab fa-google-play mr-2" /> Android
                    </a>
                  </div>
                </div>
              </div>
            </div> */}
        <div className="mt-0 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            © 2023 LinguaLearn. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CommonFooter;
