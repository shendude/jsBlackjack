var utils = require('./utils');

var g = new utils.Game();

process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  let chunck = process.stdin.read();
  if (chunck !== null) {
    g.interpret(chunck);
  }
});
process.stdin.on('end', () => {
  process.stdout.write('thanks for playing!');
})
process.on('SIGINT', () => {
  process.stdout.write('thanks for playing!');
  process.exit();
})
