var idle = artifacts.require("Idle");
var idle_permanence = artifacts.require("IdlePermanence");

module.exports = function(deployer) {
  deployer.deploy(idle);
  deployer.deploy(idle_permanence);
};