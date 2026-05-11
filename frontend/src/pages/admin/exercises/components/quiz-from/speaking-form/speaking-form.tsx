import { useState } from "react";
import SpeechRecognitionForm from "./speech-recognition-form";
import DialogueForm from "./dialogue-form";
import AppSelect from "@/components/ui/app-select";
import Speaker from "./speaker";
import { useFormContext, useWatch } from "react-hook-form";
import { createDefaultDialogueLine, useSpeakingDialogueBuilder } from "@/hooks/use-speaking-dialogue-builder";
import { generateId } from "@/utils/helpers";
import { useEffect } from "react";

const exerciseTypeOptions = [
  { label: "Speech Recognition", value: "speech_recognition" },
  { label: "Dialogue", value: "dialogue" },
];

const SpeakingForm = () => {
  const { control, setValue, getValues } = useFormContext<any>();
  const content = useWatch({ control, name: "content" }) as
    | Array<{ type?: string }>
    | undefined;

  const [selectedExerciseType, setSelectedExerciseType] = useState<string>(
    exerciseTypeOptions[0]?.value,
  );

  const sdb = useSpeakingDialogueBuilder({
    value: content as any,
    onChange: (val) => setValue("content", val),
  });

  useEffect(() => {
    const firstType = content?.[0]?.type;
    if (firstType === "dialogue") {
      setSelectedExerciseType("dialogue");
      return;
    }
    if (firstType === "follow_up") {
      setSelectedExerciseType("speech_recognition");
    }
  }, [content]);

  useEffect(() => {
    const firstType = getValues("content")?.[0]?.type;

    if (selectedExerciseType === "dialogue" && firstType !== "dialogue") {
      setValue("content", [createDefaultDialogueLine("Teacher")]);
      return;
    }

    if (selectedExerciseType === "speech_recognition" && firstType !== "follow_up") {
      setValue("content", [
        {
          id: generateId(),
          type: "follow_up",
          question: "",
          expectedAnswer: "",
          points: 1,
        },
      ]);
    }
  }, [selectedExerciseType, getValues, setValue]);

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

        {selectedExerciseType === "dialogue" && <Speaker sdb={sdb} />}
      </div>
      {selectedExerciseType === "speech_recognition" && (
        <SpeechRecognitionForm />
      )}
      {selectedExerciseType === "dialogue" && <DialogueForm sdb={sdb} />}
    </div>
  );
};

export default SpeakingForm;
