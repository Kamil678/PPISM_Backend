const express = require("express");
const technologicalDocumentationsController = require("../controllers/technologicalDocumentations");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/technological-documentations", isAuth, technologicalDocumentationsController.createTechnologicalDocuemntations);

router.get("/technological-documentations/:technologicalDocumentationsId", isAuth, technologicalDocumentationsController.getTechnologicalDocumentations);

router.put("/technological-documentations/:technologicalDocumentationsId", isAuth, technologicalDocumentationsController.updateTechnologicalDocumentations);

router.delete("/technological-documentations/:technologicalDocumentationsId", isAuth, technologicalDocumentationsController.deleteTechnologicalDocumentations);

module.exports = router;
