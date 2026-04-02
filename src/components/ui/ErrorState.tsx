"use client";
import { motion } from "framer-motion";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Failed to load data",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 text-center"
      style={{
        borderColor: "rgba(239, 68, 68, 0.3)",
        boxShadow: "0 0 20px rgba(239, 68, 68, 0.1)",
      }}
    >
      <div className="text-3xl mb-3">⚠</div>
      <p className="text-text-secondary text-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg font-heading text-xs text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/10 transition-all"
        >
          RETRY
        </button>
      )}
    </motion.div>
  );
}
