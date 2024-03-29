const express = require("express");
const cors = require("cors");
const controller = require("./controller");

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./models");

//pega os modelos e sincroniza com a tabela de dados
const sincronizar = () => {
  db.sequelize.sync(
    { force: true }
  )
    .then(() => {
      console.log("sincronizado db.");
    })
    .catch((err) => {
      console.log("Failha sincronizar db: " + err.message);
    });
}
// sincronizar();
//ao rodar a primeira vez a linha abaixo deverá ser descomentada
//nas demais execuções ela deverá permanecer comentada
//e efetuar a sicronização só quando houver alteração nos modelos
//importante saber que a sincronização apagará os dados das tabelas

app.get("/", (req, res) => {
  res.json({ message: "App está rodando" });
});

app.post("/login", controller.login);
app.post("/usuario", controller.criarUsuario);
app.post("/modelo", controller.criarModelo);
app.get("/modelo", controller.findAllModelos);
app.put("/modelo/:id", controller.editarModelo);
app.post("/moto", controller.criarMoto);
app.put("/moto/:id", controller.editarMoto);
app.get("/moto/modelo/:modelo", controller.findAllMotosByModelo);
app.get("/moto", controller.findAllMotos);
app.get("/moto/disponiveis", controller.findAllMotosDisponiveis);
app.post("/aluguel", controller.criarAluguel);
app.get("/aluguel", controller.findAllAlugueis);
app.put("/aluguel/:id", controller.editarAluguel);
app.get("/aluguel/usuario/:id", controller.findAllAlugueisByUsuario);
app.get("/usuario", controller.findAllUsuarios);

const PORT =  3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});