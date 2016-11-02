import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const jobtongSchema = new Schema({
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
    companyAddress: String,
    companyEmployeeCount: String,
    companyType: String,
    companyIndustry: String,
    companyIntroduction: String,
    parentCompanyName: String,
    parentCompanyWebsite: String,
    parentCompanyAddress: String,
    parentCompanyInfo: String,
    createAt: {
        type: Number,
        default: Date.now()
    }
});

export default mongoose.model('Jobtong', jobtongSchema, 'Jobtong');