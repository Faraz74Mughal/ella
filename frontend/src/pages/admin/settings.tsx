import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">Settings</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Platform settings</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Configure access policies and operational defaults for the admin team.
        </p>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-background/80">
          <CardHeader>
            <CardTitle>Access controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
              <span>Email verification required</span>
              <span className="font-medium text-foreground">Enabled</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
              <span>Teacher approval workflow</span>
              <span className="font-medium text-foreground">Enabled</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-background/80">
          <CardHeader>
            <CardTitle>Support actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Use these actions to keep the platform stable while new features are rolled out.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">Export audit log</Button>
              <Button variant="outline">Refresh user cache</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}