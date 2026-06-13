const optionsHandler = (methods) => (req, res) => {
  res.setHeader('Allow', methods.join(', '));
  res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
  return res.status(200).end();
};

module.exports = optionsHandler;
