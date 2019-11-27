const SHA256 = require("crypto-js/sha256");

class Block {
	constructor(timestamp, data, previousHash = "") {
		//this.index = index;
		this.previousHash = previousHash;
		this.timestamp = timestamp;
		this.data = data;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(
			this.index +
				this.previousHash +
				this.timestamp +
				JSON.stringify(this.data) +
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
		this.difficulty = 5;
	}

	createGenesisBlock() {
		return new Block("01/01/2017", "Genesis block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	// addBlock(newBlock) {
	// 	// The new block needs to point to the hash of the latest block on the chain.
	// 	newBlock.previousHash = this.getLatestBlock().hash;

	// 	// Calculate the hash of the new block
	// 	newBlock.hash = newBlock.calculateHash();

	// 	// Now the block is ready and can be added to chain!
	// 	this.chain.push(newBlock);
	// }

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
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

// TESTE DE PROCESSAMENTO
console.log("Mining block 1...");
savjeeCoin.addBlock(new Block(1, "20/07/2017", { amount: 4 }));

console.log("Mining block 2...");
savjeeCoin.addBlock(new Block(2, "20/07/2017", { amount: 8 }));

// 1 teste
//savjeeCoin.addBlock(new Block("20/07/2017", { amount: 4 }));
//savjeeCoin.addBlock(new Block("22/07/2017", { amount: 10 }));
//console.log(JSON.stringify(savjeeCoin, null, 4));

//2 e 3 teste

// console.log("Blockchain valid? " + savjeeCoin.isChainValid());

// // Tamper with the chain!
// savjeeCoin.chain[1].data = { amount: 100 };
// // Recalculate its hash, to make everything appear to be in order!
// savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash();

// // Check if it's valid again
// console.log("Blockchain valid? " + savjeeCoin.isChainValid()); // will return false!
