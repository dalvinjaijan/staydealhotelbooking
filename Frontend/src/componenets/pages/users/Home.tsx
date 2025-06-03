import React from 'react'
import Header from './Header'
import HotelSearchBar from './HotelSearchBar'

const Home = () => {
  return (
    <div>
      <Header />
      <div className='mt-16 '>
      <HotelSearchBar />

      </div>
    <img className='w-full mt-24' src="/src/assets/greenBuild.jpg" alt="" />
    </div>
  )
}

export default Home
