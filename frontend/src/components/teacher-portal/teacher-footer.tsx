import { motion } from "framer-motion";

export const TeacherFooter = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="border-t border-border/70 bg-background/95 px-6 py-4"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Ella English Learning App</p>
        <p>© {new Date().getFullYear()} Ella. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};
