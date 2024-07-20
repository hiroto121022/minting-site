import { ConnectButton, useReadContract } from "thirdweb/react";
import thirdwebIcon from "./thirdweb.svg";
import React, { useState, useEffect } from "react";
import { client } from "./client";
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { createWallet, injectedProvider, inAppWallet } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";

// connect to your contract
export const contract = getContract({ 
	client, 
	chain: defineChain(11155111), 
	address: "0xAEa068b343de1278863ef7C02131473cB5378132"
});

const wallets = [
	inAppWallet(),
	createWallet("io.metamask"),
	createWallet("com.coinbase.wallet"),
	createWallet("me.rainbow"),
];

export function App() {
	const { data:contractType, isLoading:isContractType } = useReadContract({ 
		contract, 
		method: "function contractType() pure returns (bytes32)", 
		params: [] 
	});
	const { data:contractURI, isLoading:isContractURI } = useReadContract({ 
		contract, 
		method: "function contractURI() view returns (string)", 
		params: [] 
	});
	const account = useActiveAccount();

	useEffect(() => {
		// You can perform any additional logic or side effects here
	}, [contractType, contractURI]);

	return (
		<main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
			<div className="py-20">

				<div className="flex justify-center mb-20">
					<ConnectButton
						client={client}
						wallets={wallets}
					/>
				</div>
				<div className="flex justify-center mb-20">
					{account && account.address ? (
					<BalanceComponent address={account.address} />
					) : (
					<p>ウォレットが接続されていません。</p>
					)}
				</div>
				<div className="flex justify-center mb-20">
 				    {isContractType ? (
        				<p>Loading...</p>
    				) : (
						<p>Contract Type: {contractType}</p>
    				)}
        		</div>
				<div className="flex justify-center mb-20">
 				    {isContractURI ? (
        				<p>Loading...</p>
    				) : (
						<p>Contract URI: {contractURI}</p>
    				)}
        		</div>
			</div>
		</main>
	);
}

const BalanceComponent = ({ address }: { address: string }) => {
	const { data, isLoading } = useReadContract({
		contract, 
		method: "function balanceOf(address account, uint256 id) view returns (uint256)", 
		params: [address, BigInt(0)]
	});

	return (
		<div>
			{isLoading ? (
				<p>Loading balance...</p>
			) : (
				<>
					<p>Balance: {data?.toString()}</p>
					{data && data > 0n ? (
						<p>購入しています</p>
					) : (
						<p>購入していません</p>
					)}
				</>
			)}
		</div>
	);
}
