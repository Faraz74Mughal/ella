import { useGetSingleLessonByAdmin } from "@/hooks/use-lesson";
import { ArrowRight, Music } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const LessonDetailPage = () => {
  const navigate = useNavigate();
  const {id: lessonId} = useParams();
  const {data: lesson} = useGetSingleLessonByAdmin("8fde6263d7b64fbf8d264d47"!);
  if(!lesson) return <div>Loading...</div>
  const { title,description, level, category, study_material } = lesson;

  return (
    <div className=" mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold uppercase">
            {level} • {category}
          </span>
          <h1 className="text-3xl font-extrabold mt-2 text-gray-800">
            {title}
          </h1>
        </div>
      </div>
      <div>
        <p className="text-mauve-50">{description}</p>
      </div>

      {/* Content Area */}
      {study_material&&<div className="mb-10 min-h-[400px]">
        {study_material.material_type === "video" && (
          <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
            <video
              src={study_material.content}
              controls
              className="w-full h-full"
            />
          </div>
        )}

        {study_material.material_type === "audio" && (
          <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-200 text-center">
            <Music className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <audio src={study_material.content} controls className="w-full" />
          </div>
        )}

        {study_material.material_type === "text" && (
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {/* Render markdown or plain text */}
            <p>{study_material.content}</p>
          </div>
        )}
      </div>}

      {/* Action Button */}
      <div className="flex justify-center">
        <button
        onClick={()=>navigate(`/student/exercises/${"8fde6263d7b64fbf8d264d47"}`)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
        >
          Start Quiz & Exercise <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default LessonDetailPage;
