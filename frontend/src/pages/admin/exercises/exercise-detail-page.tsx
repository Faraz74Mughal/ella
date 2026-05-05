import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import QuestionCard from "./components/details/QuestionCard";
import { useGetSingleExerciseByAdmin } from "@/hooks/use-exercise";
import { useParams } from "react-router-dom";

const ExerciseDetailPage = () => {
  const { id } = useParams();
  const {data:exercise} = useGetSingleExerciseByAdmin(id as string);
  if (!exercise) return <div>Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{exercise.title}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{exercise.category}</Badge>
            <Badge variant="outline">{exercise.level}</Badge>
            <Badge>{exercise.points} pts</Badge>
            <Badge variant="destructive">
              {exercise.passing_percentage}% pass
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        {exercise.content.map((q: any, index: number) => (
          <QuestionCard key={q.id} q={q} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
