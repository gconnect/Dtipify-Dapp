import React, { useEffect, useState} from 'react'
import CustomButton from '../components/CustomButton'
import DashboardTab from '../components/Dashboard/DashboardTab'
import WithdrawModal from '../components/Modal/WIthdrawModal'
import ShareButton from '../components/ShareButton'
import { useAccount } from 'wagmi'
import { convertHexToNumber } from '../utils/truncate'
import Image from 'next/image'
import { useContractRead } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/utils/constants'
import Link from 'next/link'

export default function Dashboard(): JSX.Element{
  const { address } = useAccount()
  const [creator, setCreator] = useState<any>({})
  const [show, setShowModal] = useState<boolean>(false)

  const data : any = useContractRead({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI.abi,
      functionName: 'getCreatorList',
      chainId: 44787,
  })

  useEffect(() => {
    if (data) {
      const value = data.data.find((item: any) => item.walletAddress === address)
      setCreator(value)
    }
  }, [address, data, creator])
  

  return (
    <div>
      {creator ? 
        <div className='bg-gray-800 p-36 m-24 rounded-md'>
      <div className='flex justify-between'>
        <div className='flex'>          
          <Image className='rounded-full' src={creator && `https://gateway.pinata.cloud/ipfs/${creator.ipfsHash}`} width="200" height={200} alt="profile-pix" />
          <div className='m-4'>
            <p>{`Hi ${creator && creator.username}`}</p>
            <Link href={`https://dtipify.vercel.app/${data === undefined ? undefined : creator.username}`}>
                <p>{`https://dtipify.vercel.app/${data === undefined ? undefined : creator.username}`}</p>
            </Link>
          </div>
        </div>
        <div>
          <ShareButton username={creator.username}/>          
          <CustomButton text='Withdraw' myStyle='bg-amber-500 mt-4' action={() => setShowModal(true)}/>
          <WithdrawModal id={convertHexToNumber(creator.id)  - 1} walletAddress={creator.walletAddress} show={show} onHide={() =>setShowModal(false)}/>
        </div>
      </div>
        <DashboardTab
          id={convertHexToNumber(creator.id) -1}
          username={creator.username}
          userbio={creator.userbio}
          walletAddress={creator.walletAddress}
          ipfsHash={creator.ipfsHash}
          donationsReceived={convertHexToNumber( creator.donationsReceived)}
          supporters={convertHexToNumber(creator.supporters)}       
        />
    </div>
      :<div className='text-center p-60 text-2xl'>Ooops! it looks like you currently do not have a profile create one now! 😄 .</div>}
    
    </div>   
  )
}
