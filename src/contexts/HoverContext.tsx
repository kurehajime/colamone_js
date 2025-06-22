import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Point } from '../model/Point'

interface HoverContextType {
  // Touch state
  touch: boolean
  setTouch: (touch: boolean) => void
  
  // Hover pointer state
  hoverPoint: Point
  setHoverPoint: (point: Point) => void
  
  // Hover number state
  hoverNumber: number | null
  setHoverNumber: (number: number | null) => void
}

const HoverContext = createContext<HoverContextType | undefined>(undefined)

interface HoverProviderProps {
  children: ReactNode
}

export const HoverProvider: React.FC<HoverProviderProps> = ({ children }) => {
  const [touch, setTouch] = useState<boolean>(false)
  const [hoverPoint, setHoverPoint] = useState<Point>({ x: 0, y: 0 })
  const [hoverNumber, setHoverNumber] = useState<number | null>(null)

  return (
    <HoverContext.Provider
      value={{
        touch,
        setTouch,
        hoverPoint,
        setHoverPoint,
        hoverNumber,
        setHoverNumber,
      }}
    >
      {children}
    </HoverContext.Provider>
  )
}

export const useHover = (): HoverContextType => {
  const context = useContext(HoverContext)
  if (context === undefined) {
    throw new Error('useHover must be used within a HoverProvider')
  }
  return context
}