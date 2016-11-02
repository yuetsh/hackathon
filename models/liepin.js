import mongoose from 'mongoose';
import mongooseToCsv from 'mongoose-to-csv';

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

liepinSchema.plugin(mongooseToCsv, {
    headers: 'Id 公司名 地址 规模 类型 领域 福利',
    constraints: {
        'Id': 'companyId',
        '公司名': 'companyName',
        '地址': 'companyAddress',
        '规模': 'companyEmployeeCount',
        '类型': 'companyType',
        '领域': 'companyIndustry',
        '福利': 'companyWelfare'
    }
});

export default mongoose.model('Liepin', liepinSchema, 'Liepin');