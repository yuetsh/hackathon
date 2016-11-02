import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const liepinSchema = new Schema({
    category: {
        type: Number,
        index: true,
        default: 666
    },
    companyId: {
        type: Number,
        index: true
    },
    companyName: {
        type: String,
        index: true
    },
    companyIndustry: String,
    companyAddress: String,
    companyEmployeeCount: String,
    companyType: String,
    companyWelfare: [String],
    createAt: {
        type: Number,
        default: Date.now()
    }
});

export default mongoose.model('Liepin', liepinSchema, 'Liepin');