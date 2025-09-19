import React from 'react'
import { motion } from 'motion/react'
import { useAppContext } from '../context/AppContext'
import CarCard from '../components/CarCard'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const Favorites = () => {
  const { favorites, cars } = useAppContext()
  
  // Filter cars to show only favorited ones
  const favoriteCars = cars.filter(car => favorites.includes(car._id))

  return (
    <div>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center py-20 bg-light max-md:px-4"
      >
        <Title
          title="Your Favorites"
          subTitle="Cars you've saved for later"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"
      >
        {favoriteCars.length > 0 ? (
          <>
            <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto mb-6">
              You have {favoriteCars.length} favorite car{favoriteCars.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:px-20 max-w-7xl mx-auto">
              {favoriteCars.map((car, index) => (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  key={car._id}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <motion.img
              src={assets.star_icon}
              alt="No favorites"
              className="h-20 w-20 mb-6 opacity-30"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <h3 className="text-2xl font-bold text-gray-600 mb-4">No Favorites Yet</h3>
            <p className="text-gray-500 mb-8 max-w-md">
              Start exploring our cars and add your favorites by clicking the star icon on any car card.
            </p>
            <motion.button
              className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dull transition-colors duration-300"
              onClick={() => window.location.href = '/cars'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Cars
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Favorites
