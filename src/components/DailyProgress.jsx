import { motion } from "framer-motion";

const DailyProgress = ({
  completed = 0,
  total = 0,
}) => {
  const percent =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );

  const getProgressColor = () => {
    if (percent === 100)
      return "from-green-500 to-emerald-500";

    if (percent >= 60)
      return "from-green-400 to-green-500";

    if (percent >= 30)
      return "from-yellow-400 to-orange-400";

    return "from-red-400 to-pink-500";
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      whileHover={{
        y: -4,
        scale: 1.01,
      }}
      className="
        rounded-3xl
        border border-white/20

        bg-gradient-to-br
        from-white/80
        via-blue-50/70
        to-purple-50/80

        backdrop-blur-2xl

        p-3 md:p-6

        shadow-[0_10px_40px_rgba(59,130,246,0.10)]

        transition-all duration-300
      "
    >
      {/* 🔷 Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.span
            animate={{
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
            className="text-2xl"
          >
            📊
          </motion.span>

          <div>
            <p className="text-sm font-medium text-gray-500">
              Daily Progress
            </p>

            <h3 className="text-lg font-bold text-gray-800">
              Today's Tasks
            </h3>
          </div>
        </div>

        <motion.div
          key={percent}
          initial={{
            scale: 0.8,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className="
            text-xl
            font-bold

            bg-gradient-to-r
            from-indigo-500
            to-purple-500

            bg-clip-text
            text-transparent
          "
        >
          {percent}%
        </motion.div>
      </div>

      {/* 🔷 Progress Bar */}
      <div className="mt-5">
        <div
          className="
            w-full
            h-4
            rounded-full

            bg-white/60

            overflow-hidden
            relative

            border border-white/30
          "
        >
          {/* Animated Fill */}
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${percent}%`,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className={`
              h-full
              rounded-full

              bg-gradient-to-r
              ${getProgressColor()}

              relative
            `}
          >
            {/* Glow */}
            <div
              className="
                absolute
                inset-0

                bg-white/20

                blur-md
              "
            />
          </motion.div>

          {/* Shine Effect */}
          <motion.div
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "linear",
            }}
            className="
              absolute
              top-0

              h-full
              w-20

              bg-white/20
              skew-x-12
            "
          />
        </div>
      </div>

      {/* 🔷 Footer */}
      <div
        className="
          mt-5
          flex
          items-center
          justify-between
          text-sm
        "
      >
        <span className="font-medium text-gray-600">
          {completed} / {total} completed
        </span>

        {percent === 100 ? (
          <motion.span
            initial={{
              scale: 0.9,
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
            className="
              text-green-600
              font-semibold
            "
          >
            🎉 Completed!
          </motion.span>
        ) : percent >= 60 ? (
          <span
            className="
              text-green-500
              font-semibold
            "
          >
            💪 Keep going!
          </span>
        ) : percent > 0 ? (
          <span
            className="
              text-yellow-500
              font-semibold
            "
          >
            ⚡ Getting there
          </span>
        ) : (
          <span className="text-gray-400">
            Start your tasks
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default DailyProgress;