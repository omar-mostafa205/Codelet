import { ComponentPropsWithoutRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className?: string
  background: ReactNode
  description: string
  Icon?: React.ElementType
  href?: string
  cta?: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[500px] grid-cols-1 md:grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  description,
  Icon,
  href,
  cta,
  ...props
}: BentoCardProps) => {
  const isBigCard = className?.includes('col-span-2')
  
  return (
    <div
      key={name}
      className={cn(
        "relative overflow-hidden rounded-xl h-full",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)]",
        className
      )}
      {...props}
    >
      {background}
      
      <div className={cn(
        "absolute bottom-0 left-0 right-0 z-10 bg-white",
        isBigCard ? "p-6" : "p-6"
      )}>
        {Icon && <Icon className="h-8 w-8 text-neutral-700 dark:text-neutral-300 mb-2" />}
        <h3 className={cn(
          "font-medium text-neutral-900 dark:text-neutral-100",
          isBigCard ? "text-2xl mb-3" : "text-2xl mb-3"
        )}>
          {name}
        </h3>
        <p className={cn(
          "text-neutral-600 dark:text-neutral-400",
          isBigCard ? "text-base leading-relaxed" : "text-base leading-relaxed"
        )}>
          {description}
        </p>
        {href && cta && (
          <a 
            href={href} 
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-2"
          >
            {cta}
            <svg 
              className="ml-2 h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
export { BentoGrid, BentoCard }