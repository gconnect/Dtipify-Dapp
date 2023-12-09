import React from 'react'
import CreatorPage from './CreatorPage';
import EarningsTab from './EarningsTab'
import ProfilePage from './ProfilePage'
import Link from 'next/link';
import { Tab } from '@headlessui/react'
import TransactionHistory from './TransactionHistory';

interface IParams {
  id: number;
  username: string;
  userbio: string;
  walletAddress: string;
  ipfsHash: string;
  donationsReceived: number;
  supporters: number;
}

export default function DashboardTab(param: IParams) : JSX.Element {
  return (
    // <div>
    //   <ul className="nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-4" id="tabs-tab"
    //   role="tablist">
    //   <li className="nav-item" role="presentation">
    //     <a href="#tabs-home" className="
    //       nav-link
    //       block
    //       font-medium
    //       text-xs
    //       leading-tight
    //       uppercase
    //       border-x-0 border-t-0 border-b-2 border-transparent
    //       px-6
    //       py-3
    //       my-2
    //       hover:border-transparent hover:bg-gray-100
    //       focus:border-transparent
    //       active
    //     " id="tabs-home-tab" data-bs-toggle="pill" data-bs-target="#tabs-home" role="tab" aria-controls="tabs-home"
    //       aria-selected="true">Earnings</a>
    //   </li>
    //   <li className="nav-item" role="presentation">
    //     <Link href="#tabs-profile" className="
    //       nav-link
    //       block
    //       font-medium
    //       text-xs
    //       leading-tight
    //       uppercase
    //       border-x-0 border-t-0 border-b-2 border-transparent
    //       px-6
    //       py-3
    //       my-2
    //       hover:border-transparent hover:bg-gray-100
    //       focus:border-transparent
    //     " id="tabs-profile-tab" data-bs-toggle="pill" data-bs-target="#tabs-profile" role="tab"
    //       aria-controls="tabs-profile" aria-selected="false">View Page</Link>
    //   </li> 
    // </ul>
    // <div className="tab-content" id="tabs-tabContent">
    //   <div className="tab-pane fade show active" id="tabs-home" role="tabpanel" aria-labelledby="tabs-home-tab">
    //       <EarningsTab donationsReceived={ param.donationsReceived} supporters={param.supporters} />
    //   </div>
    //   {/* <div className="tab-pane fade" id="tabs-profile" role="tabpanel" aria-labelledby="tabs-profile-tab">
    //       <CreatorPage id={param.id} userbio={ param.userbio} username={param.username} ipfsHash={param.ipfsHash} walletAddress={param.walletAddress} />
    //   </div> */}
    // </div>
    // </div>

  <Tab.Group manual defaultIndex={0}>
    <Tab.List className="m-2">
      <Tab className="border-b mr-2">Earnings</Tab>
      <Tab className="border-b mr-2">Transaction History</Tab>
      <Tab className="border-b mr-2">View Page</Tab>
    </Tab.List>
    <Tab.Panels>
      <Tab.Panel>
          <EarningsTab donationsReceived={ param.donationsReceived} supporters={param.supporters} />
      </Tab.Panel>
      <Tab.Panel>
        <TransactionHistory/>
      </Tab.Panel>
      <Tab.Panel>
        <CreatorPage id={param.id} userbio={ param.userbio} username={param.username} ipfsHash={param.ipfsHash} walletAddress={param.walletAddress} />
      </Tab.Panel>
    </Tab.Panels>
  </Tab.Group>
  )
}
