const db = require('../neo4j')
const uuid = require('uuid/v1')

exports.helloworld = function (req, res) {
    console.log(db)
    res.send('hello world')
}


exports.createPerson = function (req, res) {
    var id = uuid();
    var p_uid = uuid();
    var query = [
        'Create (n:Person {uid: {uid}, name: {name}, city: {city}, zipcode: {zipcode}, street: {street}, DOB: {DOB}, DOJ: {DOJ}, phone: {phone}, email: {email}, age: {age}})',
        'Return n'
      ].join('\n');

    var ParentQuery = [
        'Create (n:Person {uid: {uid}, name: {name}, city: {city}, zipcode: {zipcode}, street: {street}, phone: {phone}, email: {email}})',
        'Return n'
      ].join('\n');
    
    var RelationQuery = [
        'Match (c:Person)',
        'Where c.uid={c_uid}',
        'Match (p:Person)',
        'Where p.uid={p_uid}',
        'Create (c)-[r:Has_Parent{type: {relation}}]->(p)',
        'Return c,r,p'
    ].join('\n');

    db.cypher({
        query: query,
        params: {
            uid: id,
            name: req.body.name,
            city: req.body.city,
            street: req.body.street,
            zipcode: req.body.zipcode,
            DOB: req.body.DOB,
            DOJ: req.body.DOJ,
            phone: req.body.phone,
            email: req.body.email,
            age: req.body.age
        }
    }, function (err, results) {
        if (err) { console.log(err); res.send(err); }
        var result = results[0];
        if (!result) {
            console.log('Student not formed');
        } else {
            if (req.body.parentInfo) {
                db.cypher({
                    query: ParentQuery,
                    params: {
                        uid: p_id,
                        name: req.body.parentInfo.name,
                        city: req.body.city,
                        street: req.body.street,
                        zipcode: req.body.zipcode,
                        phone: req.body.parentInfo.phone,
                        email: req.body.parentInfo.email,
                    }
                }, function (err, nodes) {
                    if (err) { console.log(err); res.send(err); }
                    var node = nodes[0];
                    if (!node) {
                        console.log('no parent formed');
                    } else {
                        db.cypher({
                            query: RelationQuery,
                            params: {
                               c_uid: id,
                               p_uid:  p_uid,
                               relation: req.body.parentInfo.realtion
                            }
                        }, function(err, relations) {
                            if (err) { console.log(err); res.send(err); }
                            var relation = relations[0];
                            if (!relatuion) {
                                console.log('relation not formed');
                            } else {
                                res.send(relation);
                            }

                        });
                    }

                });
            }
        }
    });
}


exports.createInventory = function (req, res) {
    var id = uuid();
    var query = [
        'Create (n:Inventory {uid: {uid}, p_name: {p_name}, p_desc: {p_desc}, costPrice: {costPrice}, sellingPrice: {sellingPrice}})',
        'Return n'
      ].join('\n');

    db.cypher({
        query: query,
        params: {
            uid: id,
            p_name: req.body.p_name,
            p_desc: req.body.p_desc,
            costPrice: req.body.costPrice,
            sellingPrice: req.body.sellingPrice
        }
    }, function (err, results) {
        if (err) { console.log(err); res.send(err); }
        var result = results[0];
        if (!result) {
            console.log('Inventory not formed.');
        } else {
            res.send(result.n);
        }
    });
}

exports.createClass = function (req, res) {
    var id = uuid();
    var query = [
        'Create (n:Class {uid: {uid}, classTime: {classTime}, classDay: {classDay}, classLevel: {classLevel}})',
        'Return n'
      ].join('\n');

    db.cypher({
        query: query,
        params: {
            uid: id,
            classTime: req.body.classTime,
            classDay: req.body.classDay,
            classLevel: req.body.classLevel
        }
    }, function (err, results) {
        if (err) { console.log(err); res.send(err); }
        var result = results[0];
        if (!result) {
            console.log('Class not formed.');
        } else {
            res.send(result.n);
        }
    });
}

exports.createFee = function (req, res) {
    var id = uuid();
    var query = [
        'Match (p:Person)',
        'Where p.uid:{personUid}',
        'Create (p)-[r:Has_Fee]->(n:Fee {uid: {uid}, feeType: {feeType}, feeAmount: {feeAmount}, date: {date}})',
        'Return n'
      ].join('\n');
    
    var productQuery = [
        'Match (i:Inventory)',
        'Where i.uid = {p_uid}',
        'Match (f:Fee)',
        'Where f.uid = {f_uid}',
        'Create (f)-[r:purchased]->(i)',
        'Return i,r,f'
    ].join('\n');

    db.cypher({
        query: query,
        params: {
            uid: id,
            feeType: req.body.feeType,
            feeAmount: req.body.feeAmount,
            date: req.body.date,
        }
    }, function (err, results) {
        if (err) throw err;
        var result = results[0];
        if (!result) {
            console.log('No user found.');
        } else {
            if(req.body.feeType !== "membership") {
                db.cypher({
                    query: productQuery,
                    params: {
                        p_uid: p_uid,
                        f_uid: id,
                    }
                }, function (err, fees) {
                    if (err) { console.log(err); res.send(err); }
                    var fee = fees[0];
                    if (!fee) {
                        console.log('relation fee not formed.');
                    } else {
                        res.send(fee);
                    }
                });
            } else {
                res.send(result)
            }
        }
    });
}

exports.createRank = function (req, res) {
    var id = uuid();
    console.log(req.body);
    var query = [
        'Create (n:Rank {uid: {uid}, rankType: {rankType}})',
        'Return n'
      ].join('\n');

    db.cypher({
        query: query,
        params: {
            uid: id,
            rankType: req.body.rankType,
        }
    }, function (err, results) {
        console.log(results);
        if (err) { console.log(err); res.send(err); }
        var result = results[0];
        if (!result) {
            console.log('Inventory not formed.');
        } else {
            res.send(result.n);
        }
    });
}


exports.awardRank = function (req, res) {
    var id = uuid();
    var query = [
        'Match (p:Person)',
        'Where p.uid = {p_uid}',
        'Match (r:Rank)',
        'Where r.uid = {r_uid}',
        'Create (p)-[a:Awarded{date :{awardDate}}]->(r)',
        'Return p,a,r'
      ].join('\n');

    db.cypher({
        query: query,
        params: {
            p_uid: req.body.p_uid,
            r_uid: req.body.r_uid,
            awardDate: req.body.awardDate,
        }
    }, function (err, results) {
        if (err) { console.log(err); res.send(err); }
        var result = results[0];
        if (!result) {
            console.log('Inventory not formed.');
        } else {
            res.send(result);
        }
    });
}