const Tree = require('../models/treeModel')
const Replica = require('../models/replicaModel')
const fs = require('fs');


module.exports = {
    addTree: async (req, res) => {
        console.log('Request files:', req.file || req.files);
        console.log('Request body:', req.body);

        const local_tree = {
            ...req.body,
            owner: req.userId,
            timestamp: req.body.timestamp ? req.body.timestamp : new Date(),
            lastReplicaId: 0
        }

        try {
            const tree = await Tree.create(local_tree)
            // Gestione immagini multiple
            if (Array.isArray(req.files) && req.files.length) {
                console.log('Uploading files count:', req.files.length);
                tree.images = req.files.map(f => ({
                    data: fs.readFileSync(f.path),
                    contentType: f.mimetype
                }));
                await tree.save();
                req.files.forEach(f => fs.existsSync(f.path) && fs.unlinkSync(f.path));
            } else if (req.file) {
                console.log('Uploading single file');
                tree.images = [{
                    data: fs.readFileSync(req.file.path),
                    contentType: req.file.mimetype
                }];
                await tree.save()
                fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path);
            } else {
                await tree.save()
            }
            // Costruisci gli URL base64 per tutte le immagini (se presenti)
            const imageUrls = (tree.images || []).map(img => `data:${img.contentType};base64,${img.data.toString('base64')}`);
            res.json({"message": "Tree inserted", "tree": tree, "imageUrls": imageUrls, "success": true})
        } catch (err) {
            console.error('addTree error:', err);
            res.status(500).json({message: err.message, "success": false})
        }
    },

    getTrees: async (req, res) => {
        try {
            const trees = await Tree.find({
                owner: req.userId
            }).populate('replicas')
            if(!trees) {
                res.status(404).json({message: "Trees not found"})
            }

            const treesWithImages = trees.map(tree => {
                const imageUrls = (tree.images || []).map(img => `data:${img.contentType};base64,${img.data.toString('base64')}`);
                return { ...tree._doc, imageUrls };
            });

            res.json(treesWithImages)

        } catch (err) {
            res.status(500).json({message: err.message})
        }
        
    },

    getTree: async (req, res) => {
        try {
            const tree = await Tree.findOne({
                _id: req.params.treeId
            }).populate('replicas')
            if(!tree) {
                res.status(404).json({message: "Tree not found"})
            }
            console.log('Images count:', tree.images ? tree.images.length : 0);
            const imageUrls = (tree.images || []).map(img => `data:${img.contentType};base64,${img.data.toString('base64')}`);
            res.json({ "tree": tree, "imageUrls": imageUrls });
        } catch (err) {
            res.status(500).json({message: err.message})
        }
    },

    getReplicas: async (req, res) => {
        try {
            const replicas = await Replica.find({
                treeId: req.params.treeId
            }).populate('treeId')
            if(!replicas) {
                res.status(404).json({message: "Replicas not found"})
            }
            const replicasWithImages = replicas.map(replica => {
                const imageUrls = (replica.images || []).map(img => `data:${img.contentType};base64,${img.data.toString('base64')}`);
                return { ...replica._doc, imageUrls };
            });
            res.json(replicasWithImages)
        } catch (err) {
            res.status(500).json({message: err.message})
        }
    },

    addReplica: async (req, res) => {
        try {
            const replica = await Replica.create({
                treeId: req.body.treeId,
                notes: req.body.notes,
                diagnosticStatus: req.body.diagnosticStatus,
                bacterialTitreCq: req.body.bacterialTitreCq,
                samplingDate: req.body.samplingDate,
                plantAgeYears: req.body.plantAgeYears,
                timeSinceInfectionYears: req.body.timeSinceInfectionYears,
                timeSinceInfectionMonths: req.body.timeSinceInfectionMonths,
                timeSinceInfectionHours: req.body.timeSinceInfectionHours,
                xylellaSubspecies: req.body.xylellaSubspecies,
                xylellaSequencingType: req.body.xylellaSequencingType,
                references: req.body.references
            })
            const tree = await Tree.findOne({_id: req.body.treeId})
            if (!tree) {
                return res.status(404).json({message: "Tree not found"});
            }

            // Gestione immagini multiple
            if (Array.isArray(req.files) && req.files.length) {
                replica.images = req.files.map(f => ({
                    data: fs.readFileSync(f.path),
                    contentType: f.mimetype
                }));
                await replica.save();
                req.files.forEach(f => fs.existsSync(f.path) && fs.unlinkSync(f.path));
            } else if (req.file) {
                replica.images = [{
                    data: fs.readFileSync(req.file.path),
                    contentType: req.file.mimetype
                }];
                await replica.save();
                fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path);
            } else {
                await replica.save();
            }

            tree.replicas.push({ replicaUniqueId: replica.replicaUniqueId })
            await tree.save()
            res.json({"message": "replica inserita", "replica": replica, "id replica" : replica.replicaUniqueId, 'success': true})
        } catch (err) {
            console.error('addReplica error:', err);
            res.status(500).json({message: err.message})
        }
    },

    deleteTree: async (req, res) => {
        try {
            const tree = await Tree.findOneAndDelete({
                _id: req.params.treeId
            })
            if(!tree) {
                res.status(404).json({message: "Tree not found"})
            }
            res.json({message: "Tree deleted", "success": true})
        } catch (err) {
            res.status(500).json({message: err.message})
        }
    },

    getCultivarList: async (req, res) => {
        try {
            const mapping = Tree.getCultivarNameToCode();
            const list = Object.entries(mapping).map(([name, code]) => ({ name, code }));
            // opzionale: ordinamento alfabetico
            list.sort((a, b) => a.name.localeCompare(b.name));
            res.json({ success: true, cultivars: list });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    getSeedlingList: async (req, res) => {
        try {
            const mapping = Tree.getSeedlingIdToParents();
            const list = Object.entries(mapping).map(([id, parents]) => ({ id, parent1: parents.parent1, parent2: parents.parent2 }));
            list.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }));
            res.json({ success: true, seedlings: list });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
