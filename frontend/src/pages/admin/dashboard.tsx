import { motion } from "framer-motion";
import { ArrowUpRight, Clock3, ShieldCheck, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const overviewCards = [
  { title: "Total Users", value: "2,480", description: "Students, teachers, and admins", icon: Users },
  { title: "Active Teachers", value: "86", description: "Verified and currently teaching", icon: ShieldCheck },
  { title: "Pending Actions", value: "14", description: "Approvals and moderation items", icon: Clock3 },
];

export default function AdminDashboardPage() {
  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">Admin Dashboard</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Platform overview</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Track activity, monitor approvals, and keep the learning platform moving without switching tools.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {overviewCards.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
            >
              <Card className="h-full border-border/70 bg-background/80">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                  <div className="rounded-full border border-border/70 bg-muted/50 p-2 text-foreground">
                    <Icon className="size-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold tracking-tight">{item.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <Card className="border-border/70 bg-background/80">
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-muted/25 p-4">
                <div>
                  <p className="font-medium">Teacher approval queue updated</p>
                  <p className="mt-1 text-muted-foreground">4 new applications are waiting for review.</p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
              </div>
              <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-muted/25 p-4">
                <div>
                  <p className="font-medium">Student activity increased</p>
                  <p className="mt-1 text-muted-foreground">Daily logins are up 12% compared with last week.</p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <Card className="border-border/70 bg-background/80">
            <CardHeader>
              <CardTitle>System status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                <span>Authentication</span>
                <span className="font-medium text-foreground">Healthy</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                <span>Content delivery</span>
                <span className="font-medium text-foreground">Healthy</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                <span>Pending reviews</span>
                <span className="font-medium text-foreground">14 items</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}