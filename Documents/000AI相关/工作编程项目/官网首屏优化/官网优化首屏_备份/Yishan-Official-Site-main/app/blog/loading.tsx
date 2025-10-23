"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gray-950 py-20">
      <Container>
        {/* Hero Skeleton */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block h-8 w-32 bg-gray-800 rounded-full mb-6"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
            className="h-16 w-3/4 bg-gray-800 rounded-lg mx-auto mb-4"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="h-6 w-1/2 bg-gray-800 rounded mx-auto"
          />
        </div>

        {/* Blog Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} glass>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              >
                <div className="h-6 w-20 bg-gray-800 rounded-full mb-4" />
                <div className="h-8 w-full bg-gray-800 rounded mb-3" />
                <div className="h-4 w-full bg-gray-800 rounded mb-2" />
                <div className="h-4 w-3/4 bg-gray-800 rounded mb-4" />
                <div className="flex items-center gap-4 text-sm">
                  <div className="h-4 w-24 bg-gray-800 rounded" />
                  <div className="h-4 w-24 bg-gray-800 rounded" />
                </div>
              </motion.div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}

