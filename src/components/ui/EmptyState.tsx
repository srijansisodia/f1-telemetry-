"use client";
import { motion } from "framer-motion";

interface EmptyStateProps {
  message?: string;
  icon?: string;
}

export default function EmptyState({
  message = "No data available",
  icon = "○",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-8 text-center"
    >
      <div className="text-4xl mb-3 text-text-muted">{icon}</div>
      <p className="text-text-muted text-sm font-data">{message}</p>
    </motion.div>
  );
}
