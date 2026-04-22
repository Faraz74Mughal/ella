import { motion } from "framer-motion";
import { Button } from "./button";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface pageHeadingProps {
  title: string;
  createPageUrl?: string;
  isBack?: boolean;
}

const PageHeading = ({ title, createPageUrl,isBack }: pageHeadingProps) => {
  const navigate = useNavigate();
  const navigateHandler = () => {
    if (createPageUrl) navigate(createPageUrl);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
          {title}
        </h1>
        {createPageUrl && (
          <Button onClick={navigateHandler}>
            <Plus /> Create New {title}
          </Button>
        )}
        {isBack && (
          <Button onClick={()=>navigate(-1)}>
            <ArrowLeft /> Back
          </Button>
        )}
        
      </div>
    </motion.div>
  );
};

export default PageHeading;
