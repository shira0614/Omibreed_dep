const mongoose = require('mongoose')
const Tree = require('./treeModel')

const allowedSubspecies = ['pauca', 'fastidiosa', 'multiplex', 'NT', 'add a new record'];
const allowedSequencingTypes = [
    ...Array.from({ length: 90 }, (_, i) => `ST${i + 1}`),
    'NT'
];

const imageSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String
});

const replicaSchema = new mongoose.Schema({
    treeId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tree'
    },
    replicaUniqueId: String,
    images: {
        type: [imageSchema],
        default: []
    },
    notes: String,
    diagnosticStatus: {
        type: String,
        enum: ['H', 'X', 'NT']
    },
    bacterialTitreCq: Number,
    incrementalNumber: Number,
    samplingDate: Date,
    plantAgeYears: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'plantAgeYears must be an integer'
        },
        required: false
    },
    timeSinceInfectionYears: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'timeSinceInfectionYears must be an integer'
        },
        required: false
    },
    timeSinceInfectionMonths: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'timeSinceInfectionMonths must be an integer'
        },
        required: false
    },
    timeSinceInfectionHours: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'timeSinceInfectionHours must be an integer'
        },
        required: false
    },
    xylellaSubspecies: {
        type: String,
        enum: allowedSubspecies,
        required: false
    },
    xylellaSequencingType: {
        type: String,
        enum: allowedSequencingTypes,
        required: false
    },
    references: {
        type: String,
        required: false,
        trim: true
    }
})

replicaSchema.pre("save", async function(next) {
    try {
        if (this.isNew) {
            const myTree = await Tree.findOne({ _id: this.treeId })
            if (!myTree) return next(new Error('Parent tree not found'))

            // Determina lo stato diagnostico
            if (!this.diagnosticStatus) {
                if (typeof this.bacterialTitreCq === 'number') {
                    this.diagnosticStatus = this.bacterialTitreCq > 33 ? 'H' : (this.bacterialTitreCq < 33 ? 'X' : 'NT')
                } else {
                    this.diagnosticStatus = 'NT'
                }
            }

            // Numero incrementale globale delle repliche (ordine di inserimento del campione)
            if (typeof this.incrementalNumber !== 'number') {
                const Replica = mongoose.model('Replica')
                const latest = await Replica.find({}).sort({ incrementalNumber: -1 }).limit(1)
                const currentMax = latest.length > 0 && typeof latest[0].incrementalNumber === 'number' ? latest[0].incrementalNumber : 0
                this.incrementalNumber = currentMax + 1
            }

            // OMIBREED ID: <cultivarCode>_<H|X|NT>_<incrementalNumber>
            const cultivarCode = myTree.cultivarCode || 'UNKW'
            this.replicaUniqueId = `${cultivarCode}_${this.diagnosticStatus}_${this.incrementalNumber}`
        }
        next();
    } catch (err) {
        next(err)
    }
})

const replicaModel = mongoose.model('Replica', replicaSchema)
module.exports = replicaModel
