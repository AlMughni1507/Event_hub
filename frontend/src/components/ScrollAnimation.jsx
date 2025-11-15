import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Fade in from bottom with enhanced animation
export const FadeInUp = ({ children, delay = 0, duration = 0.8 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
        type: "spring",
        stiffness: 120,
        damping: 15
      }}
    >
      {children}
    </motion.div>
  );
};

// Fade in from left with enhanced animation
export const FadeInLeft = ({ children, delay = 0, duration = 0.8 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -80 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
        type: "spring",
        stiffness: 120,
        damping: 15
      }}
    >
      {children}
    </motion.div>
  );
};

// Fade in from right with enhanced animation
export const FadeInRight = ({ children, delay = 0, duration = 0.8 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 80 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
        type: "spring",
        stiffness: 120,
        damping: 15
      }}
    >
      {children}
    </motion.div>
  );
};

// Scale up animation with enhanced effect
export const ScaleIn = ({ children, delay = 0, duration = 0.8, scale = 0.7 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
        type: "spring",
        stiffness: 250,
        damping: 20
      }}
    >
      {children}
    </motion.div>
  );
};

// Stagger children animation with enhanced timing
export const StaggerContainer = ({ children, staggerDelay = 0.1 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.2
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, delay = 0 }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.7,
            delay,
            ease: [0.25, 0.1, 0.25, 1],
            type: "spring",
            stiffness: 180,
            damping: 18
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Hover scale animation with enhanced effect
export const HoverScale = ({ children, scale = 1.05 }) => {
  return (
    <motion.div
      whileHover={{ 
        scale,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

// Parallax effect with enhanced smoothness
export const Parallax = ({ children, speed = 0.5 }) => {
  const ref = useRef(null);
  
  return (
    <motion.div
      ref={ref}
      style={{
        willChange: 'transform'
      }}
      initial={{ y: 0 }}
      whileInView={{
        y: [0, -80 * speed, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "reverse"
      }}
      viewport={{ once: false, margin: "0px" }}
    >
      {children}
    </motion.div>
  );
};

// New: Reveal on scroll animation
export const RevealOnScroll = ({ children, delay = 0, threshold = 0.1 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      {children}
    </motion.div>
  );
};

// New: Rotate in animation
export const RotateIn = ({ children, delay = 0, duration = 0.8 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
      animate={isInView ? { opacity: 1, rotate: 0, scale: 1 } : { opacity: 0, rotate: -20, scale: 0.8 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
        type: "spring",
        stiffness: 120,
        damping: 18
      }}
    >
      {children}
    </motion.div>
  );
};

// New: Slide in with bounce effect
export const SlideInBounce = ({ children, direction = 'up', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const getInitialValues = () => {
    switch(direction) {
      case 'up': return { opacity: 0, y: 100 };
      case 'down': return { opacity: 0, y: -100 };
      case 'left': return { opacity: 0, x: 100 };
      case 'right': return { opacity: 0, x: -100 };
      default: return { opacity: 0, y: 100 };
    }
  };
  
  const getAnimateValues = () => {
    switch(direction) {
      case 'up': return { opacity: 1, y: 0 };
      case 'down': return { opacity: 1, y: 0 };
      case 'left': return { opacity: 1, x: 0 };
      case 'right': return { opacity: 1, x: 0 };
      default: return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialValues()}
      animate={isInView ? getAnimateValues() : getInitialValues()}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 300,
        damping: 20,
        bounce: 0.3
      }}
    >
      {children}
    </motion.div>
  );
};

// New: Fade in with staggered children
export const FadeInStaggerChildren = ({ children, staggerDelay = 0.1, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// New: Child item for staggered animation
export const StaggeredItem = ({ children, delay = 0 }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.6,
            delay,
            ease: [0.25, 0.1, 0.25, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// New: Floating animation
export const Floating = ({ children, delay = 0, floatDistance = 20 }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ 
        y: [-floatDistance, floatDistance, -floatDistance],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInUp;