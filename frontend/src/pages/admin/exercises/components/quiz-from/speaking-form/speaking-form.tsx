import { useState } from "react";
import SpeechRecognitionForm from "./speech-recognition-form";
import DialogueForm from "./dialogue-form";
import AppSelect from "@/components/ui/app-select";
import Speaker from "./speaker";

const exerciseTypeOptions = [
  { label: "Speech Recognition", value: "speech_recognition" },
  { label: "Dialogue", value: "dialogue" },
];

const SpeakingForm = () => {
  const [selectedExerciseType, setSelectedExerciseType] = useState<string>(
    exerciseTypeOptions[0]?.value,
  );

  return (
    <div>
      {/* <ExerciseTypeTabs
        exerciseTypeOptions={exerciseTypeOptions || []}
        value={selectedExerciseType}
        onValueChange={setSelectedExerciseType}
      /> */}
      <div className={`space-y-6`}>
        <AppSelect
          label="Type"
          className="h-10! w-full"
          options={exerciseTypeOptions}
          value={selectedExerciseType}
          onChange={(x) => setSelectedExerciseType(x as string)}
        />

        {selectedExerciseType === "dialogue" && <Speaker />}
      </div>
      {selectedExerciseType === "speech_recognition" && (
        <SpeechRecognitionForm />
      )}
      {selectedExerciseType === "dialogue" && <DialogueForm />}
    </div>
  );
};

export default SpeakingForm;
