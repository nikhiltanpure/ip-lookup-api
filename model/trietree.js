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
      let ipObj, prefix;
      if (subnet.includes(":")) {
        ipObj = new ip.Address6(subnet.split("/")[0]);
        prefix = parseInt(subnet.split("/")[1]);
      } else {
        ipObj = new ip.Address4(subnet.split("/")[0]);
        prefix = parseInt(subnet.split("/")[1]);
      }

      let node = this.root;
      for (const bit of this.ipToBits(ipObj, prefix)) {
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
      let ipObj;
      if (ipAddress.includes(":")) {
        ipObj = new ip.Address6(ipAddress);
      } else {
        ipObj = new ip.Address4(ipAddress);
      }

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

  ipToBits(ipObj, prefixLen) {
    if (ipObj instanceof ip.Address6) {
      return ipObj.bigInt().toString(2).padStart(128, "0").slice(0, prefixLen);
    } else if (ipObj instanceof ip.Address4) {
      return ipObj.parsedAddress
        .flatMap((byte) => parseInt(byte, 10).toString(2).padStart(8, "0"))
        .join("")
        .slice(0, prefixLen);
    } else {
      throw new Error("Invalid IP object");
    }
  }
}

module.exports = { IPTrie };
