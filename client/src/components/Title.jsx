import React from 'react'

const Title = ({ title, subTitle, align }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center text-center ${
        align === 'left' && 'md:items-start md:text-left'
      }`}
    >
      <h1 className='font-semibold text-4xl md:text-[40px] text-[#0A4D9F]'>{title}</h1>
      <p className='text-sm md:text-base text-[#8DA0BF] mt-2'>{subTitle}</p>
    </div>
  )
}

export default Title
