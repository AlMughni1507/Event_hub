import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        y: 30,
        filter: 'blur(10px)'
      }}
      animate={{ 
        opacity: 1,
        y: 0,
        filter: 'blur(0px)'
      }}
      exit={{ 
        opacity: 0,
        y: -30,
        filter: 'blur(10px)'
      }}
      transition={{
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
        y: {
          type: "spring",
          stiffness: 200,
          damping: 25
        },
        filter: {
          duration: 0.7
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;