IF OBJECT_ID(N'dbo.OverratedRooms', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.OverratedRooms (
    roomCode nvarchar(5) NOT NULL PRIMARY KEY,
    stateJson nvarchar(max) NOT NULL,
    createdAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updatedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;
