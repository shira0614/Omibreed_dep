const express = require('express')
const treeController = require('../controllers/treeController')
const verifyToken = require('../middleware/verifytoken.js')
const {checkColtRole} = require("../middleware/checkRole");
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Usa un percorso assoluto e assicurati che la cartella esista
const uploadDir = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

const router = express.Router()

router.use(verifyToken)
router.use(checkColtRole)

router.get('/cultivars', treeController.getCultivarList);
router.get('/seedlings', treeController.getSeedlingList);

router.post('/addTree', upload.any(), treeController.addTree)
router.post('/newReplica', upload.any(), treeController.addReplica)
router.get('/:treeId/replicas', treeController.getReplicas)
router.get('/:treeId', treeController.getTree)
router.get('/', treeController.getTrees)


module.exports = router