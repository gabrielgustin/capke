"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { floatingButtonAnimation } from "@/lib/animation-utils"

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 bg-[#f8e1e1] text-lacapke-charcoal p-3 rounded-full shadow-lg z-50"
          onClick={scrollToTop}
          variants={floatingButtonAnimation}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          exit={{ scale: 0, opacity: 0 }}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
