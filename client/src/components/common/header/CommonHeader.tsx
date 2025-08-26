import { Button } from "@/components/ui/button";

const CommonHeader = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-primary text-2xl font-bold">
            <i className="fas fa-language mr-2" />
            TalkWise
          </span>
        </div>
        {/* <div className="hidden md:flex space-x-8">
          <a href="#" className="text-dark hover:text-primary">
            Home
          </a>
          <a href="#" className="text-dark hover:text-primary">
            Courses
          </a>
          <a href="#" className="text-dark hover:text-primary">
            Features
          </a>
          <a href="#" className="text-dark hover:text-primary">
            Pricing
          </a>
          <a href="#" className="text-dark hover:text-primary">
            About
          </a>
        </div> */}
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-dark hover:text-primary hidden md:inline-block"
          >
            Login
          </a>
          <Button>Sign Up Free</Button>
          {/* <a
            href="#"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
          >
            
          </a> */}
        </div>
      </div>
    </nav>
  );
};

export default CommonHeader;
