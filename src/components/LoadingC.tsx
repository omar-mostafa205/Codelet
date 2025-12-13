
"use client"
import React, { useEffect, useState } from 'react'

interface LoadingCProps {
  isLoading: boolean;
}

const LoadingC: React.FC<LoadingCProps> = ({ isLoading }) => {
    const [currentStep, setCurrentStep] = useState(0)

    const steps = [
      {
        text: "Parsing your code...",
        color: "text-blue-500"
      },
      {
        text: "AI is understanding your repository...",
        color: "text-purple-500"
      },
      {
        text: "Analyzing code structure...",
        color: "text-green-500"
      },
      {
        text: "AI is generating tutorial content...",
        color: "text-amber-500"
      },
      {
        text: "Finalizing your tutorial...",
        color: "text-teal-500"
      }
    ]
  
    useEffect(() => {
      if (!isLoading) {
        setCurrentStep(0)
        return
      }
  
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1
          }
          return prev
        })
      }, 15000)
  
      return () => clearInterval(interval)
    }, [isLoading, steps.length])

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-8">
    <div className="w-full max-w-[600px]">
      <div className="bg-transparent p-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">Generating Your Tutorial</h1>
          <p className="text-gray-500 text-lg">This may take a few minutes...</p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                  isActive ? 'bg-gray-50 scale-105' : 'bg-transparent'
                }`}
              >
                {/* Text */}
                <div className="flex-1">
                  <p
                    className={`text-xl font-medium transition-all duration-500 ${
                      isCompleted
                        ? 'text-green-600'
                        : isActive
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.text}
                  </p>
                </div>

                {/* Status indicator */}
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    isCompleted
                      ? 'bg-green-500'
                      : isActive
                      ? 'bg-purple-500 animate-pulse'
                      : 'bg-gray-300'
                  }`}
                />
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-12">
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gray-900 h-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default LoadingC