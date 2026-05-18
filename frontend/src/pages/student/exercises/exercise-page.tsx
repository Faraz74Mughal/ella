import { useGetSingleExerciseByLessonByAdmin } from "@/hooks/use-exercise";
import { useParams } from "react-router-dom";
import GrammarQuiz from "./components/grammar-quiz";
import ListeningQuiz from "./components/listening-quiz";
import SpeakingQuiz from "./components/speaking-quiz";
import WritingQuiz from "./components/writing-quiz";
import { CATEGORY } from "@/constants/lesson.constant";

// ===================== MAIN APP =====================
export default function ExercisePage() {
  const { id } = useParams();
  const { data: exerciseQuiz } = useGetSingleExerciseByLessonByAdmin(id!);
console.log("LORAME"  , exerciseQuiz?.category?.toLowerCase());

  return (
    <div>
      {exerciseQuiz &&
        (exerciseQuiz.category?.toLowerCase() ===
          CATEGORY.GRAMMAR?.toLowerCase() ||
          exerciseQuiz.category?.toLowerCase() == "vocabulary") && (
          <GrammarQuiz exercise={exerciseQuiz} />
        )}
      {exerciseQuiz &&
        exerciseQuiz.category?.toLowerCase() ===
          CATEGORY.LISTENING?.toLowerCase() && (
          <ListeningQuiz exercise={exerciseQuiz} />
        )}
      {exerciseQuiz &&
        exerciseQuiz.category?.toLowerCase() ===
          CATEGORY.SPEAKING?.toLowerCase() && (
          <SpeakingQuiz exercise={exerciseQuiz} />
        )}
      {exerciseQuiz &&
        exerciseQuiz.category?.toLowerCase() ===
          CATEGORY.WRITING?.toLowerCase() && (
          <WritingQuiz exercise={exerciseQuiz} />
        )}
    </div>
  );
}
