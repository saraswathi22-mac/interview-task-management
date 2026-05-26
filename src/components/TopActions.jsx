import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Button from "./Button";

const TopActions = ({
  isToday,
  hasUnfinishedYesterday,
  onRollover,
}) => {
  return (
    <motion.div
      layout

      initial={{
        opacity: 0,
        y: 10,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.3,
      }}

      className="
        flex
        flex-wrap
        items-center
        gap-3
      "
    >
      {/* 🔷 Primary Action */}
      <motion.div
        whileHover={{
          y: -2,
          scale: 1.02,
        }}

        whileTap={{
          scale: 0.98,
        }}

        transition={{
          type: "spring",
          stiffness: 280,
          damping: 18,
        }}
      >
        <Link to="/add-task">
          <Button>
            <motion.span
              whileHover={{
                rotate: 90,
              }}

              transition={{
                duration: 0.25,
              }}

              className="
                mr-2

                inline-flex
                items-center
                justify-center

                w-5
                h-5

                rounded-full

                bg-white
                text-indigo-600

                text-sm
                font-bold
              "
            >
              +
            </motion.span>

            Add Task
          </Button>
        </Link>
      </motion.div>

      {/* 🔷 Secondary Action */}
      <AnimatePresence>
        {isToday &&
          hasUnfinishedYesterday && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 6,
              }}

              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                scale: 0.95,
                y: -6,
              }}

              transition={{
                duration: 0.25,
              }}

              whileHover={{
                y: -2,
              }}
            >
              <Button
                onClick={onRollover}
                variant="secondary"
              >
                ⏭ Roll over tasks
              </Button>
            </motion.div>
          )}
      </AnimatePresence>

      {/* 🔷 Hint */}
      <AnimatePresence>
        {isToday &&
          hasUnfinishedYesterday && (
            <motion.span
              initial={{
                opacity: 0,
                x: -10,
              }}

              animate={{
                opacity: 1,
                x: 0,
              }}

              exit={{
                opacity: 0,
                x: -10,
              }}

              transition={{
                duration: 0.25,
                delay: 0.05,
              }}

              className="
                text-xs
                text-gray-500

                px-3
                py-1.5

                rounded-full

                bg-white/70
                backdrop-blur-md

                border
                border-white/30

                shadow-sm
              "
            >
              You have unfinished tasks from yesterday
            </motion.span>
          )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TopActions;