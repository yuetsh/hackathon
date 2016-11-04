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

function setEmails() {
    db.Jobtong.update({emails: {$exists: false}}, {$set: {emails: []}}, {multi: true});
    db.Liepin.update({emails: {$exists: false}}, {$set: {emails: []}}, {multi: true});
}
setEmails();