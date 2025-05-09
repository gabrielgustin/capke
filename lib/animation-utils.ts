// Variantes de animación para Framer Motion
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

export const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    x: -20,
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

// Animación para el botón de añadir al carrito
export const addToCartAnimation = {
  tap: { scale: 0.95 },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
}

// Animación para tarjetas de productos
export const cardAnimation = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      type: "tween",
      ease: "easeIn",
    },
  },
  hover: {
    scale: 1.03,
    y: -5,
    transition: {
      duration: 0.2,
      type: "tween",
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.2,
      type: "tween",
      ease: "easeIn",
    },
  },
}

// Animación para el carrusel de categorías
export const categoryAnimation = {
  inactive: {
    scale: 1,
    backgroundColor: "rgba(255, 255, 255, 0)",
    transition: { duration: 0.3 },
  },
  active: {
    scale: 1.05,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
}

// Animación para notificaciones
export const notificationAnimation = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
}

// Animación para el menú móvil
export const mobileMenuAnimation = {
  closed: {
    x: "-100%",
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeInOut",
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

export const menuItemAnimation = {
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

// Animación para el botón flotante
export const floatingButtonAnimation = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      delay: 0.3,
    },
  },
  hover: {
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.9 },
}
