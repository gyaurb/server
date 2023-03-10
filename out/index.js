"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const router = express_1.default.Router();
const port = process.env.SERVER_PORT || 3000;
const env = process.env.ENVIRONMENT || "DEV";
const niubizAuthService = (env === "PROD" ? process.env.NIUBIZ_SEGURIDAD_PROD : process.env.NIUBIZ_SEGURIDAD_DEV) || "";
const niubizPinHashService = (env === "PROD" ? process.env.NIUBIZ_CERTIFICADO_PROD : process.env.NIUBIZ_CERTIFICADO_DEV) || "";
const niubizConsultaService = (env ? process.env.NIUBIZ_CONSULTA_PROD : process.env.NIUBIZ_CONSULTA_DEV) || "";
const niubizCredentials = (env ? process.env.NIUBIZ_CREDENCIALES_PROD : process.env.NIUBIZ_CREDENCIALES_DEV) || "";
app.use(express_1.default.json());
router.post("/auth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(niubizAuthService, null, { headers: { "Authorization": "Basic " + niubizCredentials } });
        res.status(200).send({
            resultado: 1,
            token: response.data,
        });
    }
    catch (error) {
        res.status(200).send({
            resultado: 0,
            mensaje: "Error en la generación de token Niubiz",
        });
    }
}));
router.post("/host", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(niubizPinHashService, null, { headers: { "Authorization": req.body.token } });
        res.status(200).send({
            resultado: 1,
            data: response.data,
        });
    }
    catch (error) {
        res.status(200).send({
            resultado: 0,
            mensaje: "Error en la generación de pinHash Niubiz",
        });
    }
}));
router.get("/consulta/:token/:idpago", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(niubizConsultaService.toString() + "/" + req.params.idpago, { headers: { "Authorization": req.params.token } });
        res.status(200).send({
            resultado: 1,
            data: response.data.order,
        });
    }
    catch (error) {
        res.status(200).send({
            resultado: 0,
            mensaje: "Error en la consulta de transacción Niubiz",
        });
    }
}));
app.use("/uapapp/api/niubiz", router);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
