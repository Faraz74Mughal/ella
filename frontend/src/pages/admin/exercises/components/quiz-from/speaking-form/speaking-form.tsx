import { useState } from "react";
import ExerciseTypeTabs from "../../exercise-type-selector";
import SpeechRecognitionForm from "./speech-recognition-form";
import DialogueForm from "./dialogue-form";

const exerciseTypeOptions = [
  { label: "Speech Recognition", value: "speech_recognition" },
  { label: "Dialogue", value: "dialogue" },
];

const SpeakingForm = () => {
  const [selectedExerciseType, setSelectedExerciseType] = useState(
    exerciseTypeOptions[0]?.value,
  );
  return (
    <div>
      <ExerciseTypeTabs
        exerciseTypeOptions={exerciseTypeOptions || []}
        value={selectedExerciseType}
        onValueChange={setSelectedExerciseType}
      />

      {selectedExerciseType === "speech_recognition" && <SpeechRecognitionForm />}
      {selectedExerciseType === "dialogue" && <DialogueForm />}
    </div>
  );
};

export default SpeakingForm;
