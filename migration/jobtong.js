/**
 * Created by linyuan on 11/2/16.
 */
function removeDuplicateCompany() {
    db.Jobtong.ensureIndex({'companyName': 1}, {unique: true, dropDups: true})
}
removeDuplicateCompany();