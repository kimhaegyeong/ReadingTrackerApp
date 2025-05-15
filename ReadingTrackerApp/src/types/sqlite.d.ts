declare module 'expo-sqlite' {
  export interface SQLiteDatabase {
    transaction: (
      txFunction: (tx: SQLiteTransaction) => void,
      errorCallback?: (error: Error) => void,
      successCallback?: () => void
    ) => void;
  }

  export interface SQLiteTransaction {
    executeSql: (
      sqlStatement: string,
      args?: any[],
      callback?: (transaction: SQLiteTransaction, resultSet: SQLiteResultSet) => void,
      errorCallback?: (transaction: SQLiteTransaction, error: Error) => boolean
    ) => void;
  }

  export interface SQLiteResultSet {
    insertId?: number;
    rowsAffected: number;
    rows: {
      length: number;
      item: (index: number) => any;
      _array: any[];
    };
  }

  export function openDatabase(name: string): SQLiteDatabase;
} 