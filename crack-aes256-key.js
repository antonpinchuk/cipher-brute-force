const crypto = require('crypto');
const cliProgress = require('cli-progress');

const KEY_LENGTH = 32;

const DECODED = Buffer.from('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'utf8')
const ENCODED = Buffer.from('cbd6465b7d3f586b280004d9eb2e71f794533fc3de71fac7bd664a778df2c9b5e3e6047a43767a37d35fe2029fb12dbf', 'hex')

const bar = new cliProgress.SingleBar({
  format: 'Brute forcing |{bar}| {percentage}% || {value}/{total} Chunks || ETA: {eta}'
}, cliProgress.Presets.shades_classic);

const key = Buffer.alloc(KEY_LENGTH).fill(0);
//const key = Buffer.from('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

bar.start(256 * 256 * 256 * 256, 0);

bforce(0)

bar.stop();

function bforce(depth) {
  if (depth === 4) {
    // progress
    bar.update(key[0] * key[1] * key[2] * key[3])
    bar.updateETA()
  }
  if (depth === KEY_LENGTH) {
    // encrypt and check match
    let mykey = crypto.createCipher('aes-128-cbc', key);
    let encoded = mykey.update(DECODED)
    encoded = Buffer.concat([encoded, mykey.final()])
    if (Buffer.compare(ENCODED, encoded) === 0) {
      bar.stop();
      console.log('Key cracked!')
      console.log(key.toString('hex'))
      process.exit()
    }
    //console.log(key.toString('hex'))
    //console.log(encoded.toString('hex'))
  } else {
    // recursive
    for (let i = 0; i < 256; i++) {
      key[depth] = i;
      bforce(depth + 1);
    }
  }
}