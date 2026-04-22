import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeacherCoursesPage() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Course management module placeholder. Structure is ready for list, filters and create flow.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
