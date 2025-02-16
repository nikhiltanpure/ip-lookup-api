const express = require("express");

const router = express.Router();

const { trie } = require("../loader");
const { validateIP, validateIPGroup } = require("../middleware/validateip");

router.post("/", validateIPGroup, (req, res) => {
  try {
    const { ips } = req.body;
    const results = ips.reduce((acc, ip) => {
      acc[ip] = trie.search(ip);
      return acc;
    }, {});
    return res.json({ results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:ip", validateIP, (req, res) => {
  try {
    const { ip } = req.params;
    return res.status(200).json({ results: trie.search(ip) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
