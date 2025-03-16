"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by rendering only after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div>
      <h3 className="font-medium mb-4">Color Theme</h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div 
          className={`border ${theme === 'light' ? 'border-2 border-primary' : 'hover:border-primary'} rounded-md p-4 flex flex-col gap-2 items-center cursor-pointer`}
          onClick={() => setTheme('light')}
        >
          <div className="h-24 w-full rounded-md bg-white border"></div>
          <p className="font-medium">Light</p>
        </div>
        
        <div 
          className={`border ${theme === 'dark' ? 'border-2 border-primary' : 'hover:border-primary'} rounded-md p-4 flex flex-col gap-2 items-center cursor-pointer`}
          onClick={() => setTheme('dark')}
        >
          <div className="h-24 w-full rounded-md bg-black"></div>
          <p className="font-medium">Dark</p>
        </div>
        
        <div 
          className={`border ${theme === 'system' ? 'border-2 border-primary' : 'hover:border-primary'} rounded-md p-4 flex flex-col gap-2 items-center cursor-pointer`}
          onClick={() => setTheme('system')}
        >
          <div className="h-24 w-full rounded-md bg-white border overflow-hidden">
            <div className="h-1/2 w-full bg-black"></div>
          </div>
          <p className="font-medium">System</p>
        </div>
      </div>
    </div>
  )
}

export function AccentColorSelector() {
  // This could be implemented similarly with your accent color functionality
  // For now, it just renders the UI without functionality
  
  return (
    <div>
      <h3 className="font-medium mb-4">Accent Color</h3>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <div className="border-2 border-primary rounded-md p-4 flex flex-col gap-2 items-center cursor-pointer">
          <div className="h-12 w-12 rounded-full bg-blue-600"></div>
          <p className="font-medium">Blue</p>
        </div>
        <div className="border rounded-md p-4 flex flex-col gap-2 items-center hover:border-primary cursor-pointer">
          <div className="h-12 w-12 rounded-full bg-purple-600"></div>
          <p className="font-medium">Purple</p>
        </div>
        <div className="border rounded-md p-4 flex flex-col gap-2 items-center hover:border-primary cursor-pointer">
          <div className="h-12 w-12 rounded-full bg-green-600"></div>
          <p className="font-medium">Green</p>
        </div>
        <div className="border rounded-md p-4 flex flex-col gap-2 items-center hover:border-primary cursor-pointer">
          <div className="h-12 w-12 rounded-full bg-orange-600"></div>
          <p className="font-medium">Orange</p>
        </div>
      </div>
    </div>
  )
}