const fs = require('fs')

const { IPTrie } = require("./model/trietree");
// Load prefixes from JSON
const trie = new IPTrie();
const prefixes = JSON.parse(fs.readFileSync("prefixes.json", "utf-8"));

Object.entries(prefixes).forEach(([provider, entries]) => {
  entries.forEach(({ prefixes, tags }) => {
    prefixes.forEach((subnet) => {
      trie.insert(subnet, provider, tags);
    });
  });
});

module.exports = { trie };
