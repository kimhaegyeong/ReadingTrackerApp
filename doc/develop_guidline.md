1. 달력은 expo-calendar 기준으로 개발해줘
2. 설치되어 있는 라이브러리를 최대한 사용해줘.

3. SQLite 함수는 아래의 문서를 참고해서 수정해줘. 마음대로 라이브러리를 설치하거나 변경하지마.
[문서]
Configuration in app config
You can configure expo-sqlite for advanced configurations using its built-in config plugin if you use config plugins in your project (EAS Build or npx expo run:[android|ios]). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect.

Example app.json with config plugin
app.json

Copy


{
  "expo": {
    "plugins": [
      [
        "expo-sqlite",
        {
          "enableFTS": true,
          "useSQLCipher": true,
          "android": {
            // Override the shared configuration for Android
            "enableFTS": false,
            "useSQLCipher": false
          },
          "ios": {
            // You can also override the shared configurations for iOS
            "customBuildFlags": ["-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1"]
          }
        }
      ]
    ]
  }
}

Show More
Configurable properties
Name	Default	Description
customBuildFlags	-	
Custom build flags to be passed to the SQLite build process.

enableFTS	true	
Whether to enable the FTS3, FTS4 and FTS5 extensions.

useSQLCipher	false	
Use the SQLCipher implementations rather than the default SQLite.

Web setup
Web support is still experimental and may be unstable. Create an issue on GitHub if you encounter any issues.
To use expo-sqlite on web, you need to configure Metro bundler to support wasm files and add HTTP headers to allow SharedArrayBuffer usage.

Add the following configuration to your metro.config.js. If you don't have the metro.config.js yet, you can run npx expo customize metro.config.js. Learn more.

metro.config.js

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
// Add wasm asset support
config.resolver.assetExts.push('wasm');
 
// Add COEP and COOP headers to support SharedArrayBuffer
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    middleware(req, res, next);
  };
};
 
module.exports = config;
If you deploy your app to web hosting services, you will also need to add the Cross-Origin-Embedder-Policy and Cross-Origin-Opener-Policy headers to your web server. Learn more about the COEP, COOP headers, and SharedArrayBuffer.

Usage
Import the module from expo-sqlite.

Import the module from expo-sqlite

Copy


import * as SQLite from 'expo-sqlite';
Basic CRUD operations
Basic CRUD operations

Copy


const db = await SQLite.openDatabaseAsync('databaseName');

// `execAsync()` is useful for bulk queries when you want to execute altogether.
// Note that `execAsync()` does not escape parameters and may lead to SQL injection.
await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
INSERT INTO test (value, intValue) VALUES ('test1', 123);
INSERT INTO test (value, intValue) VALUES ('test2', 456);
INSERT INTO test (value, intValue) VALUES ('test3', 789);
`);

// `runAsync()` is useful when you want to execute some write operations.
const result = await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', 'aaa', 100);
console.log(result.lastInsertRowId, result.changes);
await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', 999, 'aaa'); // Binding unnamed parameters from variadic arguments
await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [999, 'aaa']); // Binding unnamed parameters from array
await db.runAsync('DELETE FROM test WHERE value = $value', { $value: 'aaa' }); // Binding named parameters from object

// `getFirstAsync()` is useful when you want to get a single row from the database.
const firstRow = await db.getFirstAsync('SELECT * FROM test');
console.log(firstRow.id, firstRow.value, firstRow.intValue);

// `getAllAsync()` is useful when you want to get all results as an array of objects.
const allRows = await db.getAllAsync('SELECT * FROM test');
for (const row of allRows) {
  console.log(row.id, row.value, row.intValue);
}

// `getEachAsync()` is useful when you want to iterate SQLite query cursor.
for await (const row of db.getEachAsync('SELECT * FROM test')) {
  console.log(row.id, row.value, row.intValue);
}

Show More
Prepared statements
Prepared statements allow you to compile your SQL query once and execute it multiple times with different parameters. You can get a prepared statement by calling prepareAsync() or prepareSync() method on a database instance. The prepared statement can fulfill CRUD operations by calling executeAsync() or executeSync() method.

Note: Remember to call finalizeAsync() or finalizeSync() method to release the prepared statement after you finish using the statement. try-finally block is recommended to ensure the prepared statement is finalized.

Prepared statements

Copy


const statement = await db.prepareAsync(
  'INSERT INTO test (value, intValue) VALUES ($value, $intValue)'
);
try {
  let result = await statement.executeAsync({ $value: 'bbb', $intValue: 101 });
  console.log('bbb and 101:', result.lastInsertRowId, result.changes);

  result = await statement.executeAsync({ $value: 'ccc', $intValue: 102 });
  console.log('ccc and 102:', result.lastInsertRowId, result.changes);

  result = await statement.executeAsync({ $value: 'ddd', $intValue: 103 });
  console.log('ddd and 103:', result.lastInsertRowId, result.changes);
} finally {
  await statement.finalizeAsync();
}

const statement2 = await db.prepareAsync('SELECT * FROM test WHERE intValue >= $intValue');
try {
  const result = await statement2.executeAsync<{ value: string; intValue: number }>({
    $intValue: 100,
  });

  // `getFirstAsync()` is useful when you want to get a single row from the database.
  const firstRow = await result.getFirstAsync();
  console.log(firstRow.id, firstRow.value, firstRow.intValue);

  // Reset the SQLite query cursor to the beginning for the next `getAllAsync()` call.
  await result.resetAsync();

  // `getAllAsync()` is useful when you want to get all results as an array of objects.
  const allRows = await result.getAllAsync();
  for (const row of allRows) {
    console.log(row.value, row.intValue);
  }

  // Reset the SQLite query cursor to the beginning for the next `for-await-of` loop.
  await result.resetAsync();

  // The result object is also an async iterable. You can use it in `for-await-of` loop to iterate SQLite query cursor.
  for await (const row of result) {
    console.log(row.value, row.intValue);
  }
} finally {
  await statement2.finalizeAsync();
}

Show More
useSQLiteContext() hook
useSQLiteContext() hook

Copy


import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
        <Header />
        <Content />
      </SQLiteProvider>
    </View>
  );
}

export function Header() {
  const db = useSQLiteContext();
  const [version, setVersion] = useState('');
  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<{ 'sqlite_version()': string }>(
        'SELECT sqlite_version()'
      );
      setVersion(result['sqlite_version()']);
    }
    setup();
  }, []);
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>SQLite version: {version}</Text>
    </View>
  );
}

interface Todo {
  value: string;
  intValue: number;
}

export function Content() {
  const db = useSQLiteContext();
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<Todo>('SELECT * FROM todos');
      setTodos(result);
    }
    setup();
  }, []);

  return (
    <View style={styles.contentContainer}>
      {todos.map((todo, index) => (
        <View style={styles.todoItemContainer} key={index}>
          <Text>{`${todo.intValue} - ${todo.value}`}</Text>
        </View>
      ))}
    </View>
  );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
`);
    await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
    await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

const styles = StyleSheet.create({
  // Your styles...
});

Show More
useSQLiteContext() hook with React.Suspense
As with the useSQLiteContext() hook, you can also integrate the SQLiteProvider with React.Suspense to show a fallback component until the database is ready. To enable the integration, pass the useSuspense prop to the SQLiteProvider component.

useSQLiteContext() hook with React.Suspense

Copy


import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { Suspense } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Suspense fallback={<Fallback />}>
        <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded} useSuspense>
          <Header />
          <Content />
        </SQLiteProvider>
      </Suspense>
    </View>
  );
}
Executing queries within an async transaction
Executing queries within an async transaction

Copy


const db = await SQLite.openDatabaseAsync('databaseName');

await db.withTransactionAsync(async () => {
  const result = await db.getFirstAsync('SELECT COUNT(*) FROM USERS');
  console.log('Count:', result.rows[0]['COUNT(*)']);
});
Due to the nature of async/await, any query that runs while the transaction is active will be included in the transaction. This includes query statements that are outside of the scope function passed to withTransactionAsync() and may be surprising behavior. For example, the following test case runs queries inside and outside of a scope function passed to withTransactionAsync(). However, all of the queries will run within the actual SQL transaction because the second UPDATE query runs before the transaction finishes.

Promise.all([
  // 1. A new transaction begins
  db.withTransactionAsync(async () => {
    // 2. The value "first" is inserted into the test table and we wait 2
    //    seconds
    await db.execAsync('INSERT INTO test (data) VALUES ("first")');
    await sleep(2000);

    // 4. Two seconds in, we read the latest data from the table
    const row = await db.getFirstAsync<{ data: string }>('SELECT data FROM test');

    // ❌ The data in the table will be "second" and this expectation will fail.
    //    Additionally, this expectation will throw an error and roll back the
    //    transaction, including the `UPDATE` query below since it ran within
    //    the transaction.
    expect(row.data).toBe('first');
  }),
  // 3. One second in, the data in the test table is updated to be "second".
  //    This `UPDATE` query runs in the transaction even though its code is
  //    outside of it because the transaction happens to be active at the time
  //    this query runs.
  sleep(1000).then(async () => db.execAsync('UPDATE test SET data = "second"')),
]);

Show More
The withExclusiveTransactionAsync() function addresses this. Only queries that run within the scope function passed to withExclusiveTransactionAsync() will run within the actual SQL transaction.

Executing PRAGMA queries
Executing PRAGMA queries

Copy


const db = await SQLite.openDatabaseAsync('databaseName');
await db.execAsync('PRAGMA journal_mode = WAL');
await db.execAsync('PRAGMA foreign_keys = ON');
Tip: Enable WAL journal mode when you create a new database to improve performance in general.
Import an existing database
To open a new SQLite database using an existing .db file you already have, you can use the SQLiteProvider with assetSource.

useSQLiteContext() with existing database

Copy


import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <SQLiteProvider databaseName="test.db" assetSource={{ assetId: require('./assets/test.db') }}>
        <Header />
        <Content />
      </SQLiteProvider>
    </View>
  );
}
Sharing a database between apps/extensions (iOS)
To share a database with other apps/extensions in the same App Group, you can use shared containers by following the steps below:

1

Configure the App Group in app config:

app.json

Copy


{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.myapp",
      "entitlements": {
        "com.apple.security.application-groups": ["group.com.myapp"]
      }
    }
  }
}
2

Use Paths.appleSharedContainers from the expo-file-system library to retrieve the path to the shared container:

Using Shared Container for SQLite Database on iOS

Copy


import { SQLiteProvider, defaultDatabaseDirectory } from 'expo-sqlite';
import { Paths } from 'expo-file-system/next';
import { useMemo } from 'react';
import { Platform, View } from 'react-native';

export default function App() {
  const dbDirectory = useMemo(() => {
    if (Platform.OS === 'ios') {
      return Object.values(Paths.appleSharedContainers)?.[0]?.uri;
      // or `Paths.appleSharedContainers['group.com.myapp']?.uri` to choose specific container
    }
    return defaultDatabaseDirectory;
  }, []);

  return (
    <View style={styles.container}>
      <SQLiteProvider databaseName="test.db" directory={dbDirectory}>
        <Header />
        <Content />
      </SQLiteProvider>
    </View>
  );
}

Show More
Passing binary data
Use Uint8Array to pass binary data to the database:

Passing binary data

Copy


await db.execAsync(`
DROP TABLE IF EXISTS blobs;
CREATE TABLE IF NOT EXISTS blobs (id INTEGER PRIMARY KEY NOT NULL, data BLOB);
`);

const blob = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05]);
await db.runAsync('INSERT INTO blobs (data) VALUES (?)', blob);

const row = await db.getFirstAsync<{ data: Uint8Array }>('SELECT * FROM blobs');
expect(row.data).toEqual(blob);
Browse an on-device database
You can inspect a database, execute queries against it, and explore data with the drizzle-studio-expo dev tools plugin. This plugin enables you to launch Drizzle Studio, connected to a database in your app, directly from Expo CLI. This plugin can be used with any expo-sqlite configuration. It does not require that you use Drizzle ORM in your app. Learn how to install and use the plugin.

Key-value storage
The expo-sqlite library provides Storage as a drop-in replacement for the @react-native-async-storage/async-storage library. This key-value store is backed by SQLite. If your project already uses expo-sqlite, you can leverage expo-sqlite/kv-store without needing to add another dependency.

Storage provides the same API as @react-native-async-storage/async-storage:

Using the Store

Copy


// The storage API is the default export, you can call it Storage, AsyncStorage, or whatever you prefer.
import Storage from 'expo-sqlite/kv-store';

await Storage.setItem('key', JSON.stringify({ entity: 'value' }));
const value = await Storage.getItem('key');
const entity = JSON.parse(value);
console.log(entity); // { entity: 'value' }
A key benefit of using expo-sqlite/kv-store is the addition of synchronous APIs for added convenience:

Using the Store with synchronous APIs

Copy


// The storage API is the default export, you can call it Storage, AsyncStorage, or whatever you prefer.
import Storage from 'expo-sqlite/kv-store';

Storage.setItemSync('key', 'value');
const value = Storage.getItemSync('key');
If you're currently using @react-native-async-storage/async-storage in your project, switching to expo-sqlite/kv-store is as simple as changing the import statement:

- import AsyncStorage from '@react-native-async-storage/async-storage';
+ import AsyncStorage from 'expo-sqlite/kv-store';
Third-party library integrations
The expo-sqlite library is designed to be a solid SQLite foundation. It enables broader integrations with third-party libraries for more advanced higher-level features. Here are some of the libraries that you can use with expo-sqlite.

Drizzle ORM
Drizzle is a "headless TypeScript ORM with a head". It runs on Node.js, Bun, Deno, and React Native. It also has a CLI companion called drizzle-kit for generating SQL migrations.

Check out the Drizzle ORM documentation and the expo-sqlite integration guide for more details.

Knex.js
Knex.js is a SQL query builder that is "flexible, portable, and fun to use!"

Check out the expo-sqlite integration guide for more details.

SQLCipher
Note: SQLCipher is not supported on Expo Go.

SQLCipher is a fork of SQLite that adds encryption and authentication to the database. The expo-sqlite library supports SQLCipher for Android, iOS, and macOS. To use SQLCipher, you need to add the useSQLCipher config to your app.json as shown in the Configuration in app config section and run npx expo prebuild.

Right after you open a database, you need to set a password for the database using the PRAGMA key = 'password' statement.

Add a password to the database

Copy


const db = await SQLite.openDatabaseAsync('databaseName');
await db.execAsync(`PRAGMA key = 'password'`);
API
