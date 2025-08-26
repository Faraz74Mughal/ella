import { FaCheck, FaLeaf, FaSeedling, FaTree } from "react-icons/fa6";

const data = [
  {
    bgColor: "bg-accent-error/80",
    title: "Beginner",
    icon: <FaSeedling className="text-3xl text-accent-error" />,
    attributes: [
      "Basic vocabulary",
      "Essential grammar",
      "Conversations",
      "Pronunciation basics"
    ]
  },
  {
    bgColor: "bg-accent-warn/80",
    title: "Intermediate",
    icon: <FaLeaf className="text-3xl text-accent-warn" />,
    attributes: [
      "Advanced grammar",
      "Business English",
      "Reading comprehension",
      "Writing exercises"
    ]
  },
  {
    bgColor: "bg-accent-success/80",
    title: "Advanced",
    icon: <FaTree className="text-3xl text-accent-success" />,
    attributes: [
      "Idioms & expressions",
      "Academic English",
      "Debate & discussion",
      "Professional writing"
    ]
  }
];

const PathCard = ({
  icon,
  title,
  attributes,
  bgColor
}: {
  icon: React.ReactElement;
  title: string;
  attributes: string[];
  bgColor: string;
}) => {
  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden">
      <div className={`${bgColor} py-4 flex flex-col items-center`}>
        {/* <FaSeedling className="text-3xl text-accent-error" /> */}
        {icon}
        <h3 className="font-bold text-xl mt-2 text-white">{title}</h3>
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {attributes.map((x: string, i: number) => {
            return (
              <li key={i} className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                {x}
              </li>
            );
          })}
        </ul>
        <button
          className={`w-full mt-6 ${bgColor} cursor-pointer text-white py-2 rounded-lg font-semibold transition`}
        >
          Explore
        </button>
      </div>
    </div>
  );
};

const LearningPath = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Structured Learning Paths
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Progress through carefully designed courses tailored to your level and
          goals
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((x) => {
            return (
              <PathCard
                attributes={x.attributes}
                icon={x.icon}
                title={x.title}
                key={x.title}
                bgColor={x.bgColor}
              />
            );
          })}
          {/* <div className="bg-card rounded-xl shadow-md overflow-hidden">
          <div className="bg-accent-error/60 py-4 flex flex-col items-center">
            <FaSeedling className="text-3xl text-accent-error" />
            <h3 className="font-bold text-xl mt-2 text-white">Beginner</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Basic vocabulary
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Essential grammar
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                conversations
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Pronunciation basics
              </li>
            </ul>
            <button className="w-full mt-6 bg-accent-error/60 text-white py-2 rounded-lg font-semibold hover:bg-blue-200 transition">
              Explore
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-accent-warn/60 py-4 text-center  flex flex-col items-center">
            <FaLeaf className="text-3xl text-accent-warn" />
            <h3 className="font-bold text-xl mt-2">Intermediate</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2" /> Advanced
                grammar
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2" /> Business
                English
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2" /> Reading
                comprehension
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2" /> Writing
                exercises
              </li>
            </ul>
            <button className="w-full mt-6 bg-green-100 text-green-600 py-2 rounded-lg font-semibold hover:bg-green-200 transition">
              Explore
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-purple-100 py-4 text-center">
            <i className="fas fa-tree text-3xl text-purple-600" />
            <h3 className="font-bold text-xl mt-2">Advanced</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2" /> Idioms
                &amp; expressions
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2" /> Academic
                English
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2" /> Debate
                &amp; discussion
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2" />{" "}
                Professional writing
              </li>
            </ul>
            <button className="w-full mt-6 bg-purple-100 text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-200 transition">
              Explore
            </button>
          </div>
        </div> */}
        </div>
      </div>
    </section>
  );
};

export default LearningPath;
