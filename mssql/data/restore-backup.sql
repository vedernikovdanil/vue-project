RESTORE DATABASE [WebShopDB] FROM DISK = '/tmp/WebShopDB.bak'
WITH FILE = 1, 
MOVE 'WebShopDB_Data' TO '/var/opt/mssql/data/WebShopDB.mdf',
MOVE 'WebShopDB_Log' TO '/var/opt/mssql/data/WebShopDB.ldf',
NOUNLOAD, REPLACE, STATS = 5

GO

RESTORE FILELISTONLY FROM DISK = 'C:\Temp\docker\WebShopDB.bak'