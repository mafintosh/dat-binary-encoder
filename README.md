# dat-binary-encoder

Binary encoder/decoder for a dat changes feed

```
npm install dat-binary-encoder
```

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