import React from 'react'
import { UilCloudSun } from "@iconscout/react-unicons";
import { useNavigate } from 'react-router-dom'

function Navbar({setRerender, rerender}) {
    const navigate = useNavigate();

  return (
    <div className='p-6 bg-blue-500 flex  justify-between'>
        <div className='flex items-center space-x-2'>
        <div><UilCloudSun size={50} className="text-white"/></div>
        <div className='text-white'>Weather Forecast</div>
        </div>
        {localStorage.getItem("accessToken") !== null ? <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              setRerender(!rerender);
              navigate('/')
            }}
            className='bg-red-500 text-white p-2 rounded-xl w-36'
          >
            Log Out
          </button> : null}
    </div>
  )
}

export default Navbar