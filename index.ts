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
const niubizConsultaService = (env === "PROD" ? process.env.NIUBIZ_CONSULTA_PROD : process.env.NIUBIZ_CONSULTA_DEV) || ""
const niubizCredentials = (env === "PROD" ? process.env.NIUBIZ_CREDENCIALES_PROD : process.env.NIUBIZ_CREDENCIALES_DEV) || ""

app.use(express.json())

router.post("/auth", async (req: Request, res: Response)=> {  
  try {
    const response = await axios.post(niubizAuthService, null, { headers: {"Authorization" : "Basic "+ niubizCredentials}})    
    console.log(response)  
    res.status(200).send({
      resultado: 1,
      token: response.data,
      })    
  } catch (error) {    
      res.status(200).send({
      resultado: 0,      
      mensaje: "Error en la generación de token Niubiz",
    })    
  }
})

router.post("/host", async (req: Request, res: Response)=> {  
  console.log("host")  
  try {    
    const response = await axios.post(niubizPinHashService, null, { headers: {"Authorization" : req.body.token}})    
    console.log(response)  
    res.status(200).send({
      resultado: 1,
      data: response.data,
      })    
  } catch (error) {    
      res.status(200).send({
      resultado: 0,      
      mensaje: "Error en la generación de pinHash Niubiz",
    })    
  }
})

router.get("/consulta/:token/:idpago", async (req: Request, res : Response)=>{
  console.log("consulta")  
  try {
    const response = await axios.get(niubizConsultaService.toString() +"/"+req.params.idpago, { headers: {"Authorization" : req.params.token}})    
    console.log(response)  
    res.status(200).send({
      resultado: 1,
      data: response.data.order,
      })    
      
  } catch (error) {    
      res.status(200).send({
      resultado: 0,      
      mensaje: "Error en la consulta de transacción Niubiz",
    })
  }
})

app.use("/api/niubiz", router)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
