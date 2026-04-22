import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeacherProgressPage() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Progress tracking module placeholder. Use this space for cohort trend charts and student-level metrics.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
