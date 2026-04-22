import { motion } from "framer-motion";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const approvalItems = [
  {
    name: "Zain Ali",
    subject: "English Literature",
    status: "Pending review",
  },
  {
    name: "Sarah Khan",
    subject: "Academic Writing",
    status: "Needs documents",
  },
];

export default function AdminApprovalsPage() {
  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">Approvals</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Teacher review queue</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Review new teacher applications and move qualified candidates through the onboarding flow.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/70 bg-background/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock3 className="size-4 text-muted-foreground" />
              Waiting
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">12</CardContent>
        </Card>
        <Card className="border-border/70 bg-background/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="size-4 text-muted-foreground" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">48</CardContent>
        </Card>
        <Card className="border-border/70 bg-background/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <XCircle className="size-4 text-muted-foreground" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">3</CardContent>
        </Card>
      </div>

      <Card className="border-border/70 bg-background/80">
        <CardHeader>
          <CardTitle>Current requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {approvalItems.map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/25 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                  {item.status}
                </span>
                <Button variant="outline" size="sm">
                  Review
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}