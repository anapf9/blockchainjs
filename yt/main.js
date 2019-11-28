const SHA256 = require("crypto-js/sha256");

class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block {
	constructor(timestamp, transactions, previousHash = "") {
		this.previousHash = previousHash;
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(
			this.index +
				this.previousHash +
				this.timestamp +
				JSON.stringify(this.transactions) +
				this.nonce
		).toString();
	}

	mineBlock(difficulty) {
		// Keep changing the nonce until the hash of our block starts with enough zero's.
		while (
			this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
		) {
			this.nonce++;
			this.hash = this.calculateHash();
		}

		console.log("BLOCK MINED: " + this.hash);
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 3;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock() {
		return new Block("01/01/2017", "Genesis block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress) {
		let block = new Block("02/01/2017", this.pendingTransactions);
		block.mineBlock(this.difficulty);

		console.log("Block sucessefully mined!");
		this.chain.push(block);

		this.pendingTransactions = [
			new Transaction(null, miningRewardAddress, this.miningReward)
		];
	}

	createTransaction(transaction) {
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address) {
		let balance = 0;
		for (const block of this.chain) {
			for (const trans of block.transactions) {
				if (trans.fromAddress === address) {
					balance -= trans.amount;
				}

				if (trans.toAddress === address) {
					balance += trans.amount;
				}
			}
		}

		return balance;
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];
			//}

			// Recalculate the hash of the block and see if it matches up.
			// This allows us to detect changes to a single block
			if (currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}
			Date.now();

			// Check if this block actually points to the previous block (hash)
			if (currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}
		}

		// Check the genesis block
		// if(this.chain[0] !== this.createGenesisBlock()){
		//   return false;
		// }

		return true;
		// If we managed to get here, the chain is valid!
	}
}

let savjeeCoin = new Blockchain();

savjeeCoin.createTransaction(new Transaction("address1", "address2", 100));
savjeeCoin.createTransaction(new Transaction("address2", "address1", 50));

console.log("Starting the miner...");
savjeeCoin.minePendingTransactions("xaviers-address");

console.log(
	"Balance of xavier is",
	savjeeCoin.getBalanceOfAddress("xaviers-address")
);

console.log("Starting the miner again...");
savjeeCoin.minePendingTransactions("xaviers-address");

console.log(
	"Balance of xavier is",
	savjeeCoin.getBalanceOfAddress("xaviers-address")
);

console.log(
	"Balance of xavier is",
	savjeeCoin.getBalanceOfAddress("xaviers-address")
);

console.log("Starting the miner again...");
savjeeCoin.minePendingTransactions("xaviers-address");

console.log(
	"Balance of xavier is",
	savjeeCoin.getBalanceOfAddress("xaviers-address")
);
