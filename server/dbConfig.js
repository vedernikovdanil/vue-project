export default {
  server: process.env["MSSQL_SERVER"],
  database: process.env["MSSQL_DATABASE"],
  user: process.env["MSSQL_USER"],
  password: process.env["MSSQL_PASSWORD"],
  trustServerCertificate: true,
  port: 1433,
};
// const connectionString = `
//   server=.\\SQLEXPRESS;
//   Database=CompanyDB;
//   Trusted_Connection=Yes;
//   Driver={SQL Server Native Client 11.0}
// `;
// const query = 'SELECT * FROM Employees';

// sql.query(connectionString, query, (err, rows) => {
//   console.log(err, rows);
// });
