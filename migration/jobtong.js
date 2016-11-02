/**
 * Created by linyuan on 11/2/16.
 */
function removeDuplicateCompany() {
    db.Jobtong.aggregate([
            {
                $group: {
                    _id: '$companyName',
                    dups: {'$addToSet': '$_id'},
                    count: {$sum: 1}
                }
            },
            {
                $match: {
                    count: {"$gt": 1}
                }
            }],
        {allowDiskUse: true})
        .forEach(function (doc) {
            doc.dups.shift();
            db.Jobtong.remove({_id: {$in: doc.dups}})
        });
}
removeDuplicateCompany();