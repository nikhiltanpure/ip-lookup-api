const ipAddress = require("ip-address");
const { MAX_IP_SEARCH_LENGHT } = require("../constants");

const isValidIPv4 = (ip) => ipAddress.Address4.isValid(ip);
const isValidIPv6 = (ip) => ipAddress.Address6.isValid(ip);

const validateIP = (req, res, next) => {
  const { ip } = req.params;

  if (!ip) {
    return res.status(400).json({ error: "Missing IP address parameter" });
  }

  if (!isValidIPv4(ip) && !isValidIPv6(ip)) {
    return res.status(400).json({ error: `Invalid IP address: ${ip}` });
  }

  next();
};

const validateIPGroup = (req, res, next) => {
  const { ips } = req.body;

  if (Array.isArray(ips)) {
    if (
      ips.length > (process.env.MAX_IP_SEARCH_LENGHT || MAX_IP_SEARCH_LENGHT)
    ) {
      return res.status(400).json({
        error: `Maximum limit is ${
          process.env.MAX_IP_SEARCH_LENGHT || MAX_IP_SEARCH_LENGHT
        } IP addresses per request.`,
      });
    }

    for (const ip of ips) {
      if (!isValidIPv4(ip) && !isValidIPv6(ip)) {
        return res.status(400).json({ error: `Invalid IP address: ${ip}` });
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
