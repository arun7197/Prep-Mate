import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

const Dashboard = () => {
  return (
    <div className="p--10 my-10">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
          Welcome to PrepMate Dashboard
        </h2>
        <p className="text-md text-gray-600 dark:text-gray-300">
          Ready to ace your next interview? Create and start your personalized AI mock interview session.
        </p>
      </div>
      <AddNewInterview />
      <div >
        <InterviewList />
      </div>
      
    </div>
  )
}

export default Dashboard
