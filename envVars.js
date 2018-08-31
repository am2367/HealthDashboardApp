exports.envVarExample = (req, res) => {
    res.send(process.env.mLabUser, process.env.mLabPassword);
}
