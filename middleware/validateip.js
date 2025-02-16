const ipAddress = require("ip-address");
const { MAX_IP_SEARCH_LENGHT } = require("../constants");

const validateIP = (req, res, next) => {
  const { ip } = req.params;

  if (!ip) {
    return res.status(400).json({ error: "Missing IP address parameter" });
  }

  if (!ipAddress.Address4.isValid(ip)) {
    return res.status(400).json({ error: `Invalid IP address: ${ip}` });
  }

  next();
};

const validateIPGroup = (req, res, next) => {
  const { ips } = req.body;

  if (Array.isArray(ips)) {
    if (ips.length > MAX_IP_SEARCH_LENGHT) {
      return res
        .status(400)
        .json({ error: "Maximum limit is 10 IP addresses per request." });
    }

    for (const ip of ips) {
      if (!ipAddress.Address4.isValid(ip)) {
        return res.status(400).json({ error: `Invalid IP address: ${ipAddr}` });
      }
    }
  } else {
    return res
      .status(400)
      .json({ error: `Required list of IP addresses: ${ips}` });
  }

  next();
};

module.exports = { validateIP, validateIPGroup };
