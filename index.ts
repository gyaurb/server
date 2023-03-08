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
const niubizCredentials = process.env.NIUBIZ_CREDENTIALS_DEV || ""
const niubizAuthService = process.env.NIUBIZ_SEGURIDAD_DEV || ""
const niubizPinHashService = process.env.NIUBIZ_CERTIFICADO_DEV || ""
const niubizConsultaService = process.env.NIUBIZ_CONSULTA_DEV || ""

/*NIUBIZ_CTF_DEV
//crear rotation write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotacion diaria
  path: path.join(__dirname, "log"),
})

app.use(morgan("combined", { stream: accessLogStream }))
*/

app.use(express.json())

app.post("/login", async (req: Request, res: Response) => {
  try {
    const response = await axios.post(loginService, req.body)
    console.log(response)
    if (response.data.resultado === 1) {
      res.status(200).send({
        resultado: 1,
        token: response.data.dato.token,
        mensaje: "Inicio de sesión exitoso",
      })
    }
  } catch (error) {
    res.status(200).send({
      resultado: 0,
      //token: "",
      mensaje: "Error en las credenciales de acceso",
    })
  }
})


app.post("/niubiz-auth", async (req: Request, res: Response)=> {
  console.log("auth")
  try {
    const response = await axios.post(niubizAuthService, null, { headers: {"Authorization" : "Basic "+ niubizCredentials}})
    console.log(response.data)    
    res.status(200).send({
      resultado: 1,
      token: response.data,
      })    
  } catch (error) {
    console.log(error)    
      res.status(200).send({
      resultado: 0,
      //token: "",
      mensaje: "Error en la generación de token Niubiz",
    })    
  }
})

app.post("/niubiz-ph", async (req: Request, res: Response)=> {
  console.log("ph")
  try {
    const response = await axios.post(niubizPinHashService, null, { headers: {"Authorization" : req.body.token}})
    console.log(response.data)    
    res.status(200).send({
      resultado: 1,
      data: response.data,
      })    
  } catch (error) {
    console.log(error)    
      res.status(200).send({
      resultado: 0,
      //token: "",
      mensaje: "Error en la generación de pinHash Niubiz",
    })    
  }
})

app.get("/niubiz-consulta/:token/:idpago", async (req: Request, res : Response)=>{
  console.log("consulta")
  try {
    const response = await axios.get(niubizConsultaService.toString() +"/"+req.params.idpago, { headers: {"Authorization" : req.params.token}})    
    res.status(200).send({
      resultado: 1,
      data: response.data.order,
      })    
      
  } catch (error) {
    console.log(error)    
      res.status(200).send({
      resultado: 0,
      //token: "",
      mensaje: "Error en la consulta de transacción Niubiz",
    })
  }
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
