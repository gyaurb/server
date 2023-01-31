import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import axios from "axios"
//import morgan from "morgan"
//import path from "path"
//import rfs from "rotating-file-stream"
dotenv.config()

const app: Express = express()
const port = process.env.SERVER_PORT || 3000
const loginService = process.env.LOGIN_URL_PROD || ""

/*
//crear rotation write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotacion diaria
  path: path.join(__dirname, "log"),
})

app.use(morgan("combined", { stream: accessLogStream }))
*/

app.use(express.json())

app.get("/:username/:detail", (req: Request, res: Response) => {
  const data = {
    username: req.params.username,
    detail: req.params.detail,
  }
  res.status(200).send(data)
})

app.post("/login", async (req: Request, res: Response) => {
  console.log(req)
  try {
    const response = await axios.post(loginService, req.body)
    console.log(response)
    if (response.data.resultado === 1) {
      res.status(200).send({
        //resultado: 1,
        token: response.data.dato.token,
        mensaje: "Inicio de sesión exitoso",
      })
    }
  } catch (error) {
    res.status(401).send({
      //resultado: 0,
      //token: "",
      mensaje: "Error en las credenciales de acceso",
    })
  }
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
