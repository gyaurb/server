import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import axios from "axios"
dotenv.config()

const app: Express = express()
const router = express.Router()
const port = process.env.SERVER_PORT || 3000
const env = process.env.ENVIRONMENT || "DEV"

const niubizAuthService = (env === "PROD" ? process.env.NIUBIZ_SEGURIDAD_PROD : process.env.NIUBIZ_SEGURIDAD_DEV) || ""
const niubizPinHashService = (env === "PROD" ? process.env.NIUBIZ_CERTIFICADO_PROD : process.env.NIUBIZ_CERTIFICADO_DEV) || ""
const niubizEndPointUrl = (env === "PROD" ? process.env.NIUBIZ_ENDPOINT_PROD : process.env.NIUBIZ_ENDPOINT_DEV) || ""
const niubizHostUrl = (env === "PROD" ? process.env.NIUBIZ_HOST_PROD : process.env.NIUBIZ_HOST_DEV) || ""
const niubizCredentials = (env === "PROD" ? process.env.NIUBIZ_CREDENCIALES_PROD : process.env.NIUBIZ_CREDENCIALES_DEV) || ""

app.use(express.json())

router.post("/auth", async (req: Request, res: Response)=> {  
  console.log("auth")
  try {
    const tokenResponse = await axios.post(niubizAuthService, null, { headers: {"Authorization" : "Basic "+ niubizCredentials}})
    console.log(tokenResponse.data)
    if (tokenResponse.status === 201) {
      try {
        const pinHashResponse = await axios.post(niubizPinHashService, null, { headers: {"Authorization" : tokenResponse.data}})
        console.log(pinHashResponse.data.pinHash)
        const responseBody = {
            token : tokenResponse.data,
            pinHash : "sha256/"+pinHashResponse.data.pinHash,
            url :  niubizEndPointUrl,
            host : niubizHostUrl
        }
        console.log(responseBody)
          res.status(200).send({
          resultado: 1,
          datos: responseBody,
          })    
      } catch (error) {
        console.log(error)    
          res.status(200).send({
          resultado: 0,
          mensaje: "Error en la generación de pinHash Niubiz",
        })    
      }
    }
  } catch (error) {
    console.log(error)    
      res.status(200).send({
      resultado: 0,
      mensaje: "Error en la generación de token Niubiz",
    })    
  }
})

app.use("/api/niubiz", router)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
