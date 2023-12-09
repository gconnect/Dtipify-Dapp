import React from 'react'
import Covalent from '../images/partners/covalent-logo.png'
import AWS from '../images/partners/aws.png'
import FantomLogo from '../images/partners/fantom.png'
import Image from 'next/image'
import Link from 'next/link'

export default function PartnerSection() {
  return (
    <div className='mt-24'>
      <h3 className='text-center text-3xl p-4'>🙌  Partner Integrations 🙌 </h3>
      <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 p-8 mb-24 justify-center'>
        <Link href="https://fantom.foundation/">
          <Image src={FantomLogo} className='mt-4' width={200} alt="celo" />
        </Link>
        <Link href="https://aws.amazon.com/">
          <Image className='ml-8 mt-4' src={AWS} width={200}  alt="socialconnect" />
        </Link>
        <Link href="https://www.covalenthq.com/">
          <Image className='ml-8' src={Covalent} width={300}  alt="masa" />
        </Link>
      </div>
    </div>
  )
}
