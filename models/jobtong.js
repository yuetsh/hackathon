import mongoose from 'mongoose';
import mongooseToCsv from 'mongoose-to-csv';

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
    emails: {
        type: [String],
        index: true,
        default: []
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

jobtongSchema.plugin(mongooseToCsv, {
    headers: 'Id 公司名 HR邮箱 地址 规模 类型 领域 公司全称 网址 详细地址 信息',
    constraints: {
        'Id': 'companyId',
        '公司名': 'companyName',
        '地址': 'companyAddress',
        '规模': 'companyEmployeeCount',
        '类型': 'companyType',
        '领域': 'companyIndustry',
        '公司全称': 'parentCompanyName',
        '网址': 'parentCompanyWebsite',
        '详细地址': 'parentCompanyAddress',
        '信息': 'parentCompanyInfo'
    },
    virtuals: {
        'HR邮箱': (doc) => doc.emails && doc.emails.length ? doc.emails.join(' ') : ''
    }
});

export default mongoose.model('Jobtong', jobtongSchema, 'Jobtong');