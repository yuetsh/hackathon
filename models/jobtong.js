import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const jobtongSchema = new Schema({
    companyId: {
        type: Number,
        index: true
    },
    companyName: String,
    companyAddress: String,
    companyEmployeeCount: String,
    companyType: String,
    companyIndustry: String,
    parentCompanyName: String,
    parentCompanyWebsite: String,
    parentCompanyAddress: String,
    parentCompanyInfo: String,
    companyIntroduction: String,
    createAt: {
        type: Number,
        default: Date.now()
    }
});

export default mongoose.model('Jobtong', jobtongSchema, 'Jobtong');