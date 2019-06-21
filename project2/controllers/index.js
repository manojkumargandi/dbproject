
const uuid = require('uuid/v1');
const driver = require('../neo4j');
const session = driver.session();

exports.helloworld = function (req, res) {
    res.send('You are in the dream world welcome to get crazy');
}


createRankAndClass = function (classes, rank, pid) {
    var query = [
        'Match (p:Person {uid: {pid}})',
        'Match (c:Class {classType: {classTime}, classDay: {classDay}, classLevel: {classLevel}})',
        'Match (r:Rank{rankType: {rankType}})',
        'Create (p)-[q:Has_Rank]->(r)',
        'Create (p)-[v:Has_Class]->(c)',
        'Return p,c,r'
    ].join('\n');

    var squery = [
        'Match (p:Person {uid: {pid}})',
        'Create (p)-[q:Has_Rank]->(r)',
        'Return p,r'
    ].join('\n');

    var params = {
        pid: pid,
        classTime: classes.classTime,
        classDay: classes.classDay,
        classLevel: classes.classLevel,
        rankType: rank
    }

    console.log(query);

    session
        .run(query, params)
        .subscribe({
            onNext: function (records) {
                console.log(records);
            },
            onCompleted: function () {
                console.log('hello');
                // session.close();
            },
            onError: function (error) {
                console.log(error);
            }
        });
}

exports.createPerson = function (req, res) {
    var id = uuid();
    var p_id = uuid();
    var query = [
        'Merge (n:Person{phone: {phone}, email: {email}})',
        'On Create Set n.isStudent= {isStudent}, n.isActive= {isActive}, n.uid= {uid}, n.firstname= {firstname}, n.lastname= {lastname}, n.city= {city}, n.zipcode= {zipcode}, n.street= {street}, n.DOB= {DOB}, n.DOJ= {DOJ}, n.age= {age}',
        'On Match Set n.isStudent= {isStudent}, n.isActive= {isActive}, n.firstname= {firstname}, n.lastname= {lastname}, n.city= {city}, n.zipcode= {zipcode}, n.street= {street}, n.DOB= {DOB}, n.DOJ= {DOJ}, n.age= {age}',
        'Return n'
    ].join('\n');

    var ParentQuery = [
        'Create (n:Person {uid: {uid}, firstname: {firstname}, lastname: {lastname}, city: {city}, zipcode: {zipcode}, street: {street}, phone: {phone}, email: {email}})',
        'Return n'
    ].join('\n');

    var RelationQuery = [
        'Match (c:Person)',
        'Where c.uid={c_uid}',
        'Match (p:Person)',
        'Where p.uid={p_uid}',
        'Create (c)-[r:Has_Parent{type: {realtionShip}}]->(p)',
        'Return c,r,p'
    ].join('\n');

    var params = {
        uid: id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        city: req.body.city,
        street: req.body.street,
        zipcode: req.body.zipcode,
        DOB: req.body.DOB,
        DOJ: req.body.DOJ,
        phone: req.body.phone,
        email: req.body.email,
        age: req.body.age,
        isStudent: true,
        isActive: true
    };

    var parentParams = {
        uid: p_id,
        firstname: req.body.parentInfo ? req.body.parentInfo.firstname : '',
        lastname: req.body.parentInfo ? req.body.parentInfo.lastname : '',
        city: req.body.city,
        street: req.body.street,
        zipcode: req.body.zipcode,
        phone: req.body.parentInfo ? req.body.parentInfo.phone : '',
        email: req.body.parentInfo ? req.body.parentInfo.email : '',
    }

    var relationParams = {
        c_uid: id,
        p_uid: p_id,
        realtionShip: req.body.parentInfo ? req.body.parentInfo.relationShip : ''
    }

    var data = [];

    session
        .run(query, params)
        .subscribe({
            onNext: function (record) {
                p_id = record.get(n.uid);
                if (req.body.parentInfo) {
                    session
                        .run(ParentQuery, parentParams)
                        .subscribe({
                            onNext: function (result) {
                                session
                                    .run(RelationQuery, relationParams)
                                    .subscribe({
                                        onNext: function (results) {
                                            data.push(results);
                                        },
                                        onCompleted: function () {
                                            // session.close();
                                            res.send(data);
                                        },
                                        onError: function (error) {
                                            console.log(error);
                                            res.send(error);
                                        }
                                    });
                            },
                            onCompleted: function () {
                            },
                            onError: function (error) {
                                console.log(error);
                                res.send(error);
                            }
                        });
                } else {
                    data.push(record);
                }
            },
            onCompleted: function () {
                createRankAndClass(req.body.classes, req.body.rank, id);
                if (!req.body.parentInfo) {
                    session.close();
                    res.send(data);
                }
            },
            onError: function (error) {
                console.log(error);
                res.send(error);
            }
        });
}

exports.getStudents = function (req, res) {
    var query = [
        'Match (n:Person)',
        'Where n.isStudent=true AND n.isActive=true',
        'Return n'
    ].join('\n');

    var data = [];

    session
        .run(query)
        .subscribe({
            onNext: function (records) {
                data.push(records.toObject());
            },
            onCompleted: function () {
                session.close();
                res.send(data);
            },
            onError: function (error) {
                console.log(error);
                res.send(error); Inventory
            }

        });
}

exports.makeInactive = function (req, res) {
    var query = [
        'Match (n:Person{uid: {sid}})',
        'Set n.isActive="false"',
        'Return n'
    ].join('\n');

    var params = {
        sid: req.body.sid
    };

    var data = [];

    session
    .run(query, params)
    .subscribe({
        onNext: function(records) {
            data.push(records.toObject());
        },
        onCompleted: function() {
            session.close();
            res.send(data);
        },
        onError: function(error) {
            console.log(error);
            res.send(error);
        }
    });
}


exports.createInventory = function (req, res) {
    var id = uuid();
    var query = [
        'Merge (n:Inventory {p_name: {p_name}})',
        'On Create Set n.uid= {uid}, n.p_desc= {p_desc}, n.costPrice= {costPrice}, n.sellingPrice= {sellingPrice}, n.quantity= {quantity}',
        'On Match Set n.p_desc= {p_desc}, n.costPrice= {costPrice}, n.sellingPrice= {sellingPrice}, n.quantity= {quantity}',
        'Return n'
    ].join('\n');

    var params = {
        uid: id,
        p_name: req.body.p_name,
        p_desc: req.body.p_desc,
        costPrice: req.body.costPrice,
        sellingPrice: req.body.sellingPrice,
        quantity: req.body.quantity
    }

    var data = [];

    session
        .run(query, params)
        .subscribe({
            onNext: function (records) {
                data.push(records);
            },
            onCompleted: function () {
                session.close();
                res.send(data);
            },
            onError: function (error) {
                console.log(error);
                res.send(error);
            }
        });
}

exports.createClass = function (req, res) {
    var id = uuid();
    var query = [
        'Merge (n:Class {classTime: {classTime}, classDay: {classDay}, classLevel: {classLevel}})',
        'On Create Set n.uid= {uid}',
        'Return n'
    ].join('\n');

    var params = {
        uid: id,
        classTime: req.body.classTime,
        classDay: req.body.classDay,
        classLevel: req.body.classLevel
    }

    var data = [];

    session
        .run(query, params)
        .subscribe({
            onNext: function (record) {
                //   console.log(record.get('name'));
                data.push(record);
            },
            onCompleted: function () {
                session.close();
                res.send(data);
            },
            onError: function (error) {
                console.log(error);
                res.send(error);
            }
        });
}

exports.createFee = function (req, res) {
    var id = uuid();
    var query = [
        'Match (p:Person)',
        'Where p.phone={personPhone}',
        'Create (p)-[r:Has_Fee]->(n:Fee {uid: {uid}, feeType: {feeType}, feeAmount: {feeAmount}, feeDate: {feeDate}})',
        'Return n'
    ].join('\n');

    var productQuery = [
        'Match (i:Inventory)',
        'Where i.p_name = {p_name}',
        'Match (f:Fee)',
        'Where f.uid = {f_uid}',
        'Create (f)-[r:Purchased]->(i)',
        'Return i,r,f'
    ].join('\n');

    var params = {
        uid: id,
        personPhone: req.body.personPhone,
        feeType: req.body.feeType,
        feeAmount: req.body.feeAmount,
        feeDate: req.body.feeDate,
    }

    var productParams = {
        p_name: req.body.p_name,
        f_uid: id,
    }

    var data = [];

    session
        .run(query, params)
        .subscribe({
            onNext: function (records) {
                if (req.body.p_name !== "Membership" && req.body.p_name !== "Tests") {
                    session
                        .run(productQuery, productParams)
                        .subscribe({
                            onNext: function (results) {
                                data.push(results);
                            },
                            onCompleted: function () {
                                session.close();
                                res.send(data);
                            },
                            onError: function (error) {
                                console.log(error);
                                res.send(error);
                            }
                        });
                } else {
                    data.push(records)
                }
            },
            onCompleted: function () {
                session.close();
                if (req.body.p_name === "Membership" && req.body.p_name === "Tests") {
                    res.send(data);
                }
            },
            onError: function (error) {
                console.log(error);
                res.send(error);
            }
        });
}

exports.createRank = function (req, res) {
    var id = uuid();
    var query = [
        'Create (n:Rank {uid: {uid}, rankType: {rankType}})',
        'Return n'
    ].join('\n');

    var params = {
        uid: id,
        rankType: req.body.rankType,
    }

    var data = [];

    session
        .run(query, params)
        .subscribe({
            onNext: function (record) {
                data.push(record);
            },
            onCompleted: function () {
                session.close();
                res.send(data);
            },
            onError: function (error) {
                console.log(error);
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

    var params = {
        p_uid: req.body.p_uid,
        r_uid: req.body.r_uid,
        awardDate: req.body.awardDate,
    }

    var data = [];

    session
        .run(query, params)
        .subscribe({
            onNext: function (records) {
                data.push(records);
            },
            onCompleted: function () {
                session.close();
                res.send(data);
            },
            onError: function (err) {
                console.log(err);
                res.send(err);
            }
        });
}

exports.getInventory = function (req, res) {
    var data = [];

    var query = [
        'Match (i:Inventory)',
        'Return i'
    ].join('\n')

    session
        .run(query)
        .subscribe({
            onNext: function (records) {
                data.push(records.toObject())
            },
            onCompleted: function () {
                session.close();
                res.send(data);
            },
            onError: function (error) {
                console.log(error);
                res.send(error);
            }
        })
}

exports.getFeeDetails = function (req, res) {
    var data = [];

    var query = [
        'Match (f:Fee)<-[r:Has_Fee]-(p:Person)',
        'Return f,p'
    ].join('\n');

    session
        .run(query)
        .subscribe({
            onNext: function (records) {
                data.push(records.toObject());
            },
            onCompleted: function () {
                session.close();
                res.send(data);
            },
            onError: function (error) {
                console.log(error);
                res.send(error);
            }
        });
}


exports.getClassDetails = function (req, res) {
    var data = [];

    var query = [
        'Match (c:Class)',
        'Return c'
    ].join('\n');

    session
        .run(query)
        .subscribe({
            onNext: function (records) {
                data.push(records.toObject());
            },
            onCompleted: function () {
                session.close();
                res.send(data);
            },
            onError: function (error) {
                console.log(error);
                res.send(error);
            }
        });
}

exports.getStudentFee = function (req, res) {
    var data = [];
    console.log(req.query.id);
    var query = [
        'Match (p:Person {uid:{id}})-[r:Has_Fee]->(f:Fee)',
        'Return p,f'
    ].join('\n');

    var params = {
        id: req.query.id
    }

    session
        .run(query, params)
        .subscribe({
            onNext: function (records) {
                data.push(records.toObject());
            },
            onCompleted: function () {
                session.close();
                res.send(data);
            },
            onError: function (error) {
                console.log(error);
                res.send(error);
            }
        });
}

exports.getRanks = function (req, res) {
    var data = [];

    var query = [
        'Match (r:Rank)',
        'Return r'
    ].join('\n');

    session
        .run(query)
        .subscribe({
            onNext: function (records) {
                data.push(records.toObject());
            },
            onCompleted: function () {
                session.close();
                res.send(data);
            },
            onError: function (error) {
                console.log(error);
            }
        });
}

exports.getClassStudents = function (req, res) {
    var data = [];

    var query = [
        'Match (c:Class{uid: {id}})<-[r:Has_Class]-(p:Person)',
        'Return p'
    ].join('\n');

    var params = {
        id: req.query.id
    }

    session
    .run(query, params)
    .subscribe({
        onNext: function(records) {
            data.push(records.toObject())
        },
        onCompleted: function() {
            session.close();
            res.send(data);
        },
        onError: function(error) {
            console.log(error);
            res.send(error);
        }
    });
}

exports.createAttendance = function (req, res) {

    var query = [
        'Match (p:Person{uid: {sid}})',
        'Match (c:Class{uid: {cid}})',
        'Create (p)<-[r:Has_Att{att: {att}}]-(a:Attendance{date: {date}})<-[q:Class_att]-(c)',
        'Return p,c,a'
    ].join('\n')

    var params = {
        sid: req.body.sid,
        cid: req.body.cid,
        date: req.body.date,
        att: req.body.att
    }

    var data = [];

    session
    .run(query, params)
    .subscribe({
        onNext: function(records) {
            data.push(records.toObject());
        },
        onCompleted: function() {
            session.close();
            res.send(data);
        },
        onError: function(error) {
            console.log(error);
            res.send(error);
        }
    });
}

exports.getStudentAtt = function (req, res) {
    var data = [];

    var query = [
        'Match (p:Person {uid: {sid}})<-[r:Has_Att]-(a:Attendance)',
        'Return p,a,r'
    ].join('\n')

    var params = {
        sid: req.query.sid
    }

    session
    .run(query, params)
    .subscribe({
        onNext: function(records) {
            data.push(records.toObject());
        },
        onCompleted: function() {
            session.close();
            res.send(data);
        },
        onError: function(error) {
            console.log(error);
            res.send(error);
        }
    });
}