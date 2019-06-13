const neo4j = require('neo4j')
const db = module.exports = new neo4j.GraphDatabase('http://neo4j:neo4j@localhost:7474')