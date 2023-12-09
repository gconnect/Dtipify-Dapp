import React, {useState, useEffect} from 'react'
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import Link from 'next/link';

export default function TransactionHistory() {
    const {address } = useAccount()
    const [account, setAccount] = useState<string>("")
    const [transactions, setTransactions] = useState<any[]>([])
    const [accountbalance, setAccountBalance] = useState<number>(0)

    const fetchAccountBalanceUsingCovalentApi = (address: string) => {
        let headers = new Headers();
        headers.set('Authorization', `Bearer ${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`)
      
        fetch(`https://api.covalenthq.com/v1/fantom-mainnet/address/${address}/balances_v2/`, {method: 'GET', headers: headers})
        .then((resp) => resp.json())
        .then((data) => setAccountBalance(data.data.items[0].balance && data.data.items[0].balance/1e18));
      }


    const fetchRecentTransactionsUsingCovalentApi = (address: string) => {
        let headers = new Headers();
        headers.set('Authorization', `Bearer ${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`)

        fetch(`https://api.covalenthq.com/v1/fantom-mainnet/address/${address}/transactions_v3/`, {method: 'GET', headers: headers})
            .then((resp) => resp.json())
            .then((data) => setTransactions( data.data && data.data.items));
        }

    useEffect(() => {
        if(address){
            setAccount(address)
            fetchRecentTransactionsUsingCovalentApi(account)
            fetchAccountBalanceUsingCovalentApi(account)
        }
    }, [account, address])

  return (
    <div>
        <h1>{ `Account Balance ${accountbalance}`}</h1>
   <div className="flex flex-col">
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
        <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
            <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                <th scope="col" className="px-6 py-4">Block Height</th>
                <th scope="col" className="px-6 py-4">Tx Hash</th>
                <th scope="col" className="px-6 py-4">Value</th>
                <th scope="col" className="px-6 py-4">Tx Date</th>
                </tr>
            </thead>
            <tbody>
                {transactions && transactions.map((item, index) =>    <tr key={index} className="border-b dark:border-neutral-500">
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{item.block_height}</td>
                    <td className="whitespace-nowrap px-6 py-4 hover:text-blue-500"><Link href={`https://ftmscan.com/tx/${item.tx_hash}`}>
                    {item.tx_hash}
                    </Link></td>
                    <td className="whitespace-nowrap px-6 py-4">{ethers.utils.formatEther(item.value)}</td>
                    <td className="whitespace-nowrap px-6 py-4">{item.block_signed_at}</td>
                </tr> 
                )}
             
            </tbody>
            </table>
        </div>
        </div>
  </div>
</div>
    </div>
  )
}
