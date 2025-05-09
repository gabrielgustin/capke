"use client"
import { motion } from "framer-motion"
import Image from "next/image"

const SplashScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-lacapke-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: 0,
            y: [0, -10, 0],
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            y: {
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            },
          }}
          className="relative h-40 w-40 mb-8"
        >
          <Image src="/finall.png" alt="La Capke" fill className="object-contain" priority />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-2xl font-bold text-lacapke-charcoal mb-2">La Capke</h1>
          <p className="text-lacapke-charcoal/70 text-sm mb-6">Cargando menú...</p>

          <div className="w-48 h-2 bg-lacapke-charcoal/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-lacapke-accent"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default SplashScreen
