"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function SimpleHamburgerIcon() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <button
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={isOpen}
      className="relative focus:outline-none focus:ring-2 focus:ring-[#d4b45a]/50 rounded-md p-2 transition-all duration-300 bg-[#121628]"
      onClick={() => setIsOpen(!isOpen)}
      style={{ width: "48px", height: "48px" }}
    >
      <div className="w-6 h-5 flex flex-col justify-between mx-auto">
        <motion.span
          className="w-full h-[2px] bg-[#d4b45a] block"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 9 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="w-full h-[2px] bg-[#d4b45a] block"
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="w-full h-[2px] bg-[#d4b45a] block"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -9 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </button>
  )
}
