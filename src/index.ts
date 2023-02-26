
import build from './app'

const app = build({
  logger: {
    level: 'info',
    // prettyPrint: true,
    serializers: {
      req: req => ({
        method: req.method,
        url: req.url,
        headers: req.headers
      }),
      res: res => ({
        statusCode: res.statusCode,
        headers: res.getHeaders()
      })
    },
    stream: process.stdout // This line will output logs to stdout
  }
})

app.listen({ port: 3000 }, (err) => {
  if (err != null) {
    console.error(err)
    process.exit(1)
  }
})
