import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
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
        ease: [0.4, 0, 0.2, 1], // Material Design easing
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

export default PageTransition;
