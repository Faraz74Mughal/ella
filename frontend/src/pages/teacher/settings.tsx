import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeacherSettingsPage() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Settings module placeholder. Add profile preferences, notifications and workspace options here.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
