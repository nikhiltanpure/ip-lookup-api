const express = require("express");

const router = express.Router();

const { trie } = require("../loader");
const { validateIP, validateIPGroup } = require("../middleware/validateip");

/**
 * @swagger
 * /lookup:
 *   post:
 *     summary: Lookup an IP or batch of IPs in Cloud Provider prefixes
 *     description: Returns provider and tags if an IP belongs to a known subnet.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ips:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["184.51.33.230", "8.8.8.8"]
 *     responses:
 *       200:
 *         description: Successful response with matching providers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         subnet:
 *                           type: string
 *                           example: "184.51.33.0/24"
 *                         provider:
 *                           type: string
 *                           example: "Akamai"
 *                         tags:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Cloud", "CDN/WAF"]
 *       400:
 *         description: Invalid input (missing parameter or bad format).
 *       500:
 *         description: Server error.
 */
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

/**
 * @swagger
 * /lookup/{ip}:
 *   get:
 *     summary: Lookup a single IP address in Cloud Provider prefixes
 *     description: Returns the provider and tags if an IP belongs to a known subnet.
 *     parameters:
 *       - in: path
 *         name: ip
 *         required: true
 *         description: IP address to lookup.
 *         schema:
 *           type: string
 *           example: "18.244.0.0"
 *     responses:
 *       200:
 *         description: Successful response with matching subnets.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subnet:
 *                         type: string
 *                         example: "18.244.0.0/15"
 *                       provider:
 *                         type: string
 *                         example: "AWS"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Cloud", "CDN"]
 *       400:
 *         description: Invalid IP address format.
 *       404:
 *         description: IP not found in any subnet.
 *       500:
 *         description: Server error.
 */
router.get("/:ip", validateIP, (req, res) => {
  try {
    const { ip } = req.params;
    return res.status(200).json({ results: trie.search(ip) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
