const ip = require("ip-address");

class TrieNode {
  constructor() {
    this.children = {};
    this.data = [];
  }
}

class IPTrie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(subnet, provider, tags) {
    try {
      const network = new ip.Address4(subnet.split("/")[0]);
      const prefix = parseInt(subnet.split("/")[1]);
      let node = this.root;

      for (const bit of this.ipToBits(network, prefix)) {
        if (!node.children[bit]) {
          node.children[bit] = new TrieNode();
        }
        node = node.children[bit];
      }
      node.data.push({ subnet, provider, tags });
    } catch (error) {
      console.error(`Error inserting subnet ${subnet}: ${error.message}`);
    }
  }

  search(ipAddress) {
    try {
      const ipObj = new ip.Address4(ipAddress);
      let node = this.root;
      let results = [];

      for (const bit of this.ipToBits(ipObj)) {
        if (node.children[bit]) {
          node = node.children[bit];
          if (node.data.length > 0) {
            results = [...results, ...node.data];
          }
        } else {
          break;
        }
      }
      return results;
    } catch (error) {
      console.error(`Error searching IP ${ipAddress}: ${error.message}`);
      return [];
    }
  }

  ipToBits(ipObj, prefixLen = 32) {
    return ipObj
      .toArray()
      .flatMap((byte) => byte.toString(2).padStart(8, "0"))
      .join("")
      .slice(0, prefixLen);
  }
}

module.exports = { IPTrie };
