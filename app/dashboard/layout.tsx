import React from 'react'
import Header from './_components/Header'
import { Toaster } from "@/components/ui/sonner"
import MobileRestriction from './_components/MobileRestriction'

function Dashboardlayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <MobileRestriction />
      <Header />
      <div className="mx-5 md:mx-20 lg:mx-36">{children}
        <Toaster />
      </div>
    </div>
  )
}

export default Dashboardlayout