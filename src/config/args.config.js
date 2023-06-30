const { Command } = require("commander");

const program = new Command();

program
  .option("-d, --debug <debug>", "Debug variable", false) //just an example. the value is not being use
  .option("-m, --mode <mode>", "Development environment", "production");

program.parse();

module.exports = program.opts();
