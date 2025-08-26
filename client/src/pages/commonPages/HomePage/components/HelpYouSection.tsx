import React from "react";
import { FaBookOpen, FaChartLine, FaGamepad, FaMicrophone } from "react-icons/fa6";

const data = [
  {
    icon: <FaBookOpen className="text-white text-2xl" />,
    title: "Structured Lessons",
    text: "Our comprehensive approach combines technology with proven language learning methods"
  },  {
    icon: <FaMicrophone className="text-white text-2xl" />,
    title: "Speaking Practice",
    text: "AI-powered pronunciation feedback and conversation practice"
  },
    {
    icon: <FaGamepad className="text-white text-2xl" />,
    title: "Gamification",
    text: "Earn points, badges, and compete on leaderboards"
  },
    {
    icon: <FaChartLine  className="text-white text-2xl"/>,
    title: "Progress Tracking",
    text: "Detailed analytics and certificates to mark your achievements"
  }
];

const HelpPart = ({
  icon,
  title,
  text
}: {
  icon: React.ReactElement;
  title: string;
  text: string;
}) => {
  return (
    <div className="bg-light p-6 rounded-xl text-center">
      <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};

const HelpYouSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl !text-primary font-bold text text-center mb-4">
          How TalkWise Helps You
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Our comprehensive approach combines technology with proven language
          learning methods
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((x)=>{
            return (
                <HelpPart key={x.title} title={x.title} text={x.text} icon={x.icon} />
            )
          })}
         </div>
      </div>
    </section>
  );
};

export default HelpYouSection;
