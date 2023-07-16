import express, { NextFunction, Request, Response } from 'express'
import router from './routes/routers'
import bodyParser from 'body-parser'

const app = express()

const PORT: number = 5000

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', router)

app.use((err: Error, _: Request, res: Response, _1: NextFunction) => {
  res.status(200).json({ message: err.message })
})

app.all('/*', function (_, res, _1) {
  // CORS headers
  res.set('Content-Type', 'application/json')
})

app.listen(PORT, () => console.log(`Server is started on port ${PORT}`))

export default app
