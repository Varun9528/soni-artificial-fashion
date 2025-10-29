// Simple database adapter to replace Prisma for MySQL connections
const mysql = require('mysql2/promise');

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'soni_artificial_fashion',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  async findMany(table, where = {}, select = '*') {
    let sql = `SELECT ${select} FROM ${table}`;
    const params = [];
    
    if (Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map(key => `${key} = ?`);
      sql += ` WHERE ${conditions.join(' AND ')}`;
      params.push(...Object.values(where));
    }
    
    return await this.query(sql, params);
  }

  async findUnique(table, where, select = '*') {
    const results = await this.findMany(table, where, select);
    return results.length > 0 ? results[0] : null;
  }

  async create(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const result = await this.query(sql, values);
    
    return {
      id: result.insertId,
      ...data
    };
  }

  async update(table, where, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    const whereKeys = Object.keys(where);
    const whereValues = Object.values(where);
    const whereClause = whereKeys.map(key => `${key} = ?`).join(' AND ');
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const params = [...values, ...whereValues];
    
    return await this.query(sql, params);
  }

  async delete(table, where) {
    const whereKeys = Object.keys(where);
    const whereValues = Object.values(where);
    const whereClause = whereKeys.map(key => `${key} = ?`).join(' AND ');
    
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    return await this.query(sql, whereValues);
  }
}

// Create a singleton instance
const db = new Database();

module.exports = db;