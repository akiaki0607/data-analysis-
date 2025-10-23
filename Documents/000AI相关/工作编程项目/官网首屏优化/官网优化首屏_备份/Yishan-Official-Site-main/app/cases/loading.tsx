"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";

export default function CasesLoading() {
  return (
    <div className="min-h-screen bg-gray-950 py-20">
      <Container>
        {/* Hero Skeleton */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-16 w-3/4 bg-gray-800 rounded-lg mx-auto mb-4"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
            className="h-6 w-1/2 bg-gray-800 rounded mx-auto"
          />
        </div>

        {/* Cases Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} glass>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-8 w-48 bg-gray-800 rounded" />
                  <div className="h-6 w-20 bg-gray-800 rounded-full" />
                </div>
                <div className="h-4 w-32 bg-gray-800 rounded mb-4" />
                <div className="h-4 w-full bg-gray-800 rounded mb-2" />
                <div className="h-4 w-full bg-gray-800 rounded mb-2" />
                <div className="h-4 w-3/4 bg-gray-800 rounded mb-6" />
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j}>
                      <div className="h-8 w-full bg-gray-800 rounded mb-1" />
                      <div className="h-3 w-16 bg-gray-800 rounded" />
                    </div>
                  ))}
                </div>

                <div className="h-10 w-32 bg-gray-800 rounded" />
              </motion.div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}

