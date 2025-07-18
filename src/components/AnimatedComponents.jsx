import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Fade in animation
export const FadeIn = ({ children, delay = 0, duration = 0.5, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

// Slide in animation
export const SlideIn = ({ children, direction = 'left', delay = 0, duration = 0.5, ...props }) => {
  const directions = {
    left: { x: -100 },
    right: { x: 100 },
    up: { y: -100 },
    down: { y: 100 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Scale animation
export const ScaleIn = ({ children, delay = 0, duration = 0.5, ...props }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

// Bounce animation
export const Bounce = ({ children, ...props }) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Pulse animation
export const Pulse = ({ children, ...props }) => (
  <motion.div
    animate={{
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Celebration animation
export const Celebration = ({ children, ...props }) => (
  <motion.div
    animate={{
      scale: [1, 1.2, 1.1, 1.3, 1],
      rotate: [0, 5, -5, 10, 0],
    }}
    transition={{
      duration: 0.8,
      ease: "easeInOut",
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Hover animation wrapper
export const HoverScale = ({ children, scale = 1.05, ...props }) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Confetti animation
export const Confetti = ({ isActive, ...props }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        {...props}
      >
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
              rotate: 0,
              opacity: 1
            }}
            animate={{
              y: window.innerHeight + 20,
              rotate: 360,
              opacity: 0
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          >
            {['🎉', '🎊', '✨', '🌟', '🎈', '🎁'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

// Stagger children animation
export const StaggerContainer = ({ children, staggerDelay = 0.1, ...props }) => (
  <motion.div
    initial="initial"
    animate="animate"
    variants={{
      initial: {},
      animate: {
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Stagger child animation
export const StaggerChild = ({ children, ...props }) => (
  <motion.div
    variants={{
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Modal animation
export const Modal = ({ children, isOpen, onClose, ...props }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative z-10"
          {...props}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Loading spinner
export const LoadingSpinner = ({ size = 40, ...props }) => (
  <motion.div
    className="rounded-full border-2 border-purple-200 border-t-purple-500"
    style={{ width: size, height: size }}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    {...props}
  />
);

// Success checkmark animation
export const SuccessCheck = ({ ...props }) => (
  <motion.div
    className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    {...props}
  >
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.polyline points="20,6 9,17 4,12" />
    </motion.svg>
  </motion.div>
);

export default {
  FadeIn,
  SlideIn,
  ScaleIn,
  Bounce,
  Pulse,
  Celebration,
  HoverScale,
  Confetti,
  StaggerContainer,
  StaggerChild,
  Modal,
  LoadingSpinner,
  SuccessCheck
}; 