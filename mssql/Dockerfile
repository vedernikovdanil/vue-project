FROM mcr.microsoft.com/mssql/server:2022-latest

ENV ACCEPT_EULA=Y
ENV MSSQL_SA_PASSWORD=Password1!

COPY ./data /tmp

RUN /opt/mssql/bin/sqlservr --accept-eula & sleep 15 \
  && /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Password1! -i /tmp/restore-backup.sql