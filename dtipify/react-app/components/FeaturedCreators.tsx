import React, { useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Creator from './Creator'
import SupporterModal from './Modal/SupporterModal'
import { convertHexToNumber, truncate } from '../utils/truncate'
import { useContractRead } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/utils/constants'
import { ethers } from 'ethers'
import Link from 'next/link'

export default function FeaturedCreators() {  
  const [creators, setCreators] = useState<any[]>([])

  const { data } = useContractRead({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI.abi,
      functionName: 'getCreatorList',
  })

  let selectedObjects: any[] = [];

  const shuffledArray: any = data && data?.slice(); // Create a shallow copy of the original array

  // Shuffle the array using Fisher-Yates algorithm
  for (let i = shuffledArray && shuffledArray.length  - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  // Select the first 'count' elements from the shuffled array
  selectedObjects = shuffledArray && shuffledArray.slice(0, 3);

  useEffect(() => {
    setCreators(selectedObjects as any[])
  }, [])

// console.log(data)
  return (
    <div>
      {creators === undefined || creators.length === 0 ? <div></div> : 
        <div>
          <h3 className='text-center text-3xl'> 👌 Featured Creators 👌 </h3>
          <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-center p-8 '>
            {creators && creators.map((creator, index) => <div className='mx-2' key={index}>
              <Creator
                id={convertHexToNumber(creator.id) - 1}
                name={creator.username}
                bio={creator.userbio}
                verified={creator.verified}
                earnings={creator.donationsReceived.toString()/1e18 }
                currency="AVAX" supporters={convertHexToNumber(creator.supporters)}
                image={`https://gateway.pinata.cloud/ipfs/${creator.ipfsHash}`}
                creatorAddress={creator.walletAddress}  
                phoneContact={creator.phoneContact}            
              />
             {/* <SupporterModal myId={creator.id} username={creator.username} walletAddress ={creator.creatorAddress} /> */}
            </div>
            )}       
          </div>
          <Link href="/creators">
            <p className='text-center text-2xl pb-4'>See more...</p>
          </Link>
        </div>
      }
    </div>
  )
}
