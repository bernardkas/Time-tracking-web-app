import React from 'react'

interface TitleProps {
  children: React.ReactNode;
}
const Title = ({ children }: TitleProps) => {
  return (
    <h1 className="text-2xl font-bold font-sans">
        {children}
    </h1>
  )
}

export default Title