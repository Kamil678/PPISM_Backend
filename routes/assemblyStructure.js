const express = require("express");
const assemblyStructureController = require("../controllers/assemblyStructure");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/assembly-structure", isAuth, assemblyStructureController.getAssemblyStructures);

router.post("/assembly-structure", isAuth, assemblyStructureController.createAssemblyStructure);

router.get("/assembly-structure/:assemblyStructureId", isAuth, assemblyStructureController.getAssemblyStructure);

router.put("/assembly-structure/:assemblyStructureId", isAuth, assemblyStructureController.updateAssemblyStructure);

router.delete("/assembly-structure/:assemblyStructureId", isAuth, assemblyStructureController.deleteAssemblyStructure);

module.exports = router;
