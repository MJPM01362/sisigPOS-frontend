import { motion, AnimatePresence } from "framer-motion";
import { STATIC_BASE } from "../../../services/api";

const HeroSection = ({ topProducts, currentIndex }) => {
  return (
    <section className="relative bg-[#1B1B1D] rounded-2xl shadow overflow-hidden h-full flex-shrink-0">
      <h2 className="absolute top-10 left-10 text-gray-800 z-20 leading-tight">
        <span className="text-[#FA6501] text-5xl font-bold">
          Top Selling<br />Products
        </span>
      </h2>

      {topProducts.length === 0 ? (
        <p className="text-gray-500 text-center py-6 mt-10">
          No top-selling products yet.
        </p>
      ) : (
        <div className="relative w-full h-full flex items-center">
          <AnimatePresence mode="wait">
            {topProducts.length > 0 && (
              <motion.div
                key={topProducts[currentIndex]?.productId}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center h-full"
              >
                <div className="basis-[30%] mt-10 pl-10 z-20 flex flex-col justify-center">
                  <h3 className="text-2xl font-medium text-white leading-snug pt-10">
                    {topProducts[currentIndex].name}
                  </h3>
                </div>

                {topProducts[currentIndex]?.image ? (
                  <div className="relative basis-[80%] h-full">
                    <img
                      src={`${STATIC_BASE}${topProducts[currentIndex].image}`}
                      alt={topProducts[currentIndex].name}
                      className="absolute right-0 top-0 w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-[#1B1B1D]/50 to-[#1B1B1D]"></div>
                  </div>
                ) : (
                  <div className="basis-[70%] h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {topProducts.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "bg-[#fe7400]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;