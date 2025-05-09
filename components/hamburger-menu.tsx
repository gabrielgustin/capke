"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Utensils, ShoppingBag, X } from "lucide-react"
import Link from "next/link"

interface HamburgerMenuProps {
  cartItemCount?: number
  user?: {
    name: string
    email: string
  } | null
}

const HamburgerIcon = ({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) => {
  return (
    <button
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={isOpen}
      className="relative z-50 focus:outline-none focus:ring-2 focus:ring-[#d4b45a]/50 rounded-md p-2 transition-all duration-300"
      onClick={onClick}
    >
      <div className="w-6 h-5 flex flex-col justify-between">
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

export default function HamburgerMenu({ cartItemCount = 0, user = null }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Variantes para animaciones
  const menuVariants = {
    closed: {
      x: "-100%",
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren",
      },
    },
    open: {
      x: 0,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <>
      <HamburgerIcon onClick={toggleMenu} isOpen={isOpen} />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* Menú deslizable */}
            <motion.div
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-[320px] bg-[#121628] z-50 flex flex-col shadow-xl"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Botón de cierre */}
              <motion.button
                className="absolute top-4 right-4 text-[#f8f8f8] hover:text-[#d4b45a] transition-colors p-2"
                onClick={closeMenu}
                variants={itemVariants}
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </motion.button>

              {/* Cabecera con logo/avatar */}
              <motion.div
                className="flex flex-col items-center pt-12 pb-6 border-b border-[#d4b45a]/20"
                variants={itemVariants}
              >
                <div className="w-20 h-20 rounded-full bg-[#d4b45a]/10 flex items-center justify-center mb-4 border-2 border-[#d4b45a]/30">
                  {/* Logo o avatar */}
                  <span className="text-[#d4b45a] text-2xl font-bold">LOGO</span>
                </div>

                {user ? (
                  <div className="text-center">
                    <p className="text-[#f8f8f8] font-medium">{user.name}</p>
                    <p className="text-[#f8f8f8]/70 text-sm">{user.email}</p>
                  </div>
                ) : (
                  <button
                    className="px-6 py-2 bg-[#d4b45a] text-[#121628] rounded-md font-medium hover:bg-[#d4b45a]/90 transition-colors"
                    onClick={() => {
                      closeMenu()
                      // Aquí iría la lógica para abrir el modal de inicio de sesión
                    }}
                  >
                    Iniciar Sesión
                  </button>
                )}
              </motion.div>

              {/* Navegación */}
              <motion.nav className="flex-1 py-6 px-4">
                <ul className="space-y-4">
                  <motion.li variants={itemVariants}>
                    <Link
                      href="/"
                      className="flex items-center gap-3 text-[#f8f8f8] hover:text-[#d4b45a] p-3 rounded-md hover:bg-white/5 transition-colors"
                      onClick={closeMenu}
                    >
                      <Home size={20} />
                      <span>Inicio</span>
                    </Link>
                  </motion.li>

                  <motion.li variants={itemVariants}>
                    <Link
                      href="/menu"
                      className="flex items-center gap-3 text-[#f8f8f8] hover:text-[#d4b45a] p-3 rounded-md hover:bg-white/5 transition-colors"
                      onClick={closeMenu}
                    >
                      <Utensils size={20} />
                      <span>Menú</span>
                    </Link>
                  </motion.li>

                  <motion.li variants={itemVariants}>
                    <Link
                      href="/cart"
                      className="flex items-center gap-3 text-[#f8f8f8] hover:text-[#d4b45a] p-3 rounded-md hover:bg-white/5 transition-colors relative"
                      onClick={closeMenu}
                    >
                      <div className="relative">
                        <ShoppingBag size={20} />
                        {cartItemCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-[#d4b45a] text-[#121628] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItemCount > 9 ? "9+" : cartItemCount}
                          </span>
                        )}
                      </div>
                      <span>Mi Pedido</span>
                    </Link>
                  </motion.li>
                </ul>
              </motion.nav>

              {/* Footer */}
              <motion.div
                className="mt-auto p-4 border-t border-[#d4b45a]/20 text-[#f8f8f8]/50 text-sm text-center"
                variants={itemVariants}
              >
                © 2025 Capke
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navegación para escritorio (visible solo en pantallas grandes) */}
      <nav className="hidden lg:flex items-center gap-6">
        <Link href="/" className="text-[#f8f8f8] hover:text-[#d4b45a] transition-colors flex items-center gap-2">
          <Home size={18} />
          <span>Inicio</span>
        </Link>
        <Link href="/menu" className="text-[#f8f8f8] hover:text-[#d4b45a] transition-colors flex items-center gap-2">
          <Utensils size={18} />
          <span>Menú</span>
        </Link>
        <Link
          href="/cart"
          className="text-[#f8f8f8] hover:text-[#d4b45a] transition-colors flex items-center gap-2 relative"
        >
          <div className="relative">
            <ShoppingBag size={18} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#d4b45a] text-[#121628] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </div>
          <span>Mi Pedido</span>
        </Link>
      </nav>
    </>
  )
}
