import React, { useState } from 'react'
import Sidebar from '../../Component/Admin/Sidebar'

export default function Dashboard() {
  return (
    <Sidebar>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Ini kontennya muncul di sebelah kanan sidebar.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae, tempore.</p>
    </Sidebar>
  )
}
