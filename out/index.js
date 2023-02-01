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
//import morgan from "morgan"
//import path from "path"
//import rfs from "rotating-file-stream"
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.SERVER_PORT || 3000;
const loginService = process.env.LOGIN_URL_PROD || "";
/*
//crear rotation write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotacion diaria
  path: path.join(__dirname, "log"),
})

app.use(morgan("combined", { stream: accessLogStream }))
*/
app.use(express_1.default.json());
app.get("/:username/:detail", (req, res) => {
    const data = {
        username: req.params.username,
        detail: req.params.detail,
    };
    res.status(200).send(data);
});
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    try {
        const response = yield axios_1.default.post(loginService, req.body);
        console.log(response);
        if (response.data.resultado === 1) {
            res.status(200).send({
                resultado: 1,
                token: response.data.dato.token,
                mensaje: "Inicio de sesión exitoso",
            });
        }
    }
    catch (error) {
        res.status(200).send({
            resultado: 0,
            //token: "",
            mensaje: "Error en las credenciales de acceso",
        });
    }
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
