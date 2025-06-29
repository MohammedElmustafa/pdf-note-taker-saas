import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function WorkspaceHeader({fileName}) {
  return (
    <div className='p-5 flex justify-between shadow-md'>
        <Image src={'/logo.svg'} alt='logo' width={220} height={220}/>
        <h2 className='font-bold'>{fileName}</h2>
        <UserButton />
    </div>
  )
}

export default WorkspaceHeader