import React from 'react';
import { motion } from 'framer-motion';

// PILIHAN 1: Slide + Blur (Modern & Smooth - AKTIF SEKARANG)
export const SlideBlurTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        x: 100,
        filter: 'blur(10px)'
      }}
      animate={{ 
        opacity: 1,
        x: 0,
        filter: 'blur(0px)'
      }}
      exit={{ 
        opacity: 0,
        x: -100,
        filter: 'blur(10px)'
      }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        x: {
          type: "spring",
          stiffness: 260,
          damping: 25
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// PILIHAN 2: Fade + Scale (Minimalist & Elegant)
export const FadeScaleTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        scale: 0.97
      }}
      animate={{ 
        opacity: 1,
        scale: 1
      }}
      exit={{ 
        opacity: 0,
        scale: 0.97
      }}
      transition={{
        duration: 0.3,
        ease: [0.6, 0.05, 0.01, 0.9]
      }}
    >
      {children}
    </motion.div>
  );
};

// PILIHAN 3: Swipe (iOS Style)
export const SwipeTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        x: '100%'
      }}
      animate={{ 
        opacity: 1,
        x: 0
      }}
      exit={{ 
        opacity: 0,
        x: '-100%'
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }}
    >
      {children}
    </motion.div>
  );
};

// PILIHAN 4: Zoom Fade (Cinematic)
export const ZoomFadeTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        scale: 1.1,
        filter: 'blur(5px)'
      }}
      animate={{ 
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)'
      }}
      exit={{ 
        opacity: 0,
        scale: 0.9,
        filter: 'blur(5px)'
      }}
      transition={{
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
    >
      {children}
    </motion.div>
  );
};

// PILIHAN 5: Slide Up (Clean & Simple)
export const SlideUpTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        y: 50
      }}
      animate={{ 
        opacity: 1,
        y: 0
      }}
      exit={{ 
        opacity: 0,
        y: -50
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      {children}
    </motion.div>
  );
};

// PILIHAN 6: Flip (Dramatic)
export const FlipTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        rotateY: 90
      }}
      animate={{ 
        opacity: 1,
        rotateY: 0
      }}
      exit={{ 
        opacity: 0,
        rotateY: -90
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut"
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
    >
      {children}
    </motion.div>
  );
};

// PILIHAN 7: Crossfade (Ultra Smooth)
export const CrossfadeTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0
      }}
      animate={{ 
        opacity: 1
      }}
      exit={{ 
        opacity: 0
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// PILIHAN 8: Wipe (Modern Card Style)
export const WipeTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        clipPath: 'inset(0 100% 0 0)'
      }}
      animate={{ 
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)'
      }}
      exit={{ 
        opacity: 0,
        clipPath: 'inset(0 0 0 100%)'
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

// Default export - gunakan yang mana aja
export default SlideBlurTransition;
