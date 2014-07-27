# dat-binary-encoder

Binary encoder/decoder for a dat changes feed

```
npm install dat-binary-encoder
```

[![build status](http://img.shields.io/travis/mafintosh/dat-binary-encoder.svg?style=flat)](http://travis-ci.org/mafintosh/dat-binary-encoder)
![dat](http://img.shields.io/badge/Development%20sponsored%20by-dat-green.svg?style=flat)

## Usage

To encode a changes feed

``` js
var enc = require('dat-binary-encoder')

db.createChangesReadStream()
  .pipe(enc.encode())
  .pipe(someWritableStream)
```

And to decode a changes feed

``` js
someReadableStream
  .pipe(enc.decode())
  .pipe(db.createChangesWriteStream())
```

## License

MIT