let books = [];
let idCounter = 1;

module.exports = {
  openDatabaseAsync: jest.fn(() => Promise.resolve({
    execAsync: jest.fn(),
    getAllAsync: jest.fn(() => Promise.resolve([...books])),
    getFirstAsync: jest.fn((query, ...params) => {
      if (query.includes('WHERE id = ?')) {
        const id = params[0];
        return Promise.resolve(books.find(b => b.id === id) || null);
      }
      if (query.includes('WHERE title = ? AND author = ?')) {
        const [title, author] = params;
        return Promise.resolve(books.find(b => b.title === title && b.author === author) || null);
      }
      return Promise.resolve(null);
    }),
    runAsync: jest.fn((query, ...params) => {
      if (query.startsWith('INSERT INTO books')) {
        const [title, author, isbn, pages, status, cover_color, cover] = params;
        // 중복 방지
        if (books.find(b => b.title === title && b.author === author && b.isbn === isbn)) {
          return Promise.reject(new Error('Duplicate book'));
        }
        const newBook = {
          id: idCounter++,
          title, author, isbn, pages, status, cover_color, cover
        };
        books.push(newBook);
        return Promise.resolve({ lastInsertRowId: newBook.id });
      }
      if (query.startsWith('DELETE FROM books')) {
        const id = params[0];
        books = books.filter(b => b.id !== id);
        return Promise.resolve();
      }
      if (query.startsWith('UPDATE books')) {
        // 동적 파라미터 매핑: fields = Object.keys(update), values = Object.values(update), 마지막 id
        const id = params[params.length - 1];
        const book = books.find(b => b.id === id);
        if (book) {
          // fields: title = ?, author = ?, status = ? 등 동적
          const fieldMatches = query.match(/SET (.+) WHERE/);
          if (fieldMatches && fieldMatches[1]) {
            const fields = fieldMatches[1].split(',').map(f => f.trim().split(' ')[0]);
            fields.forEach((field, idx) => {
              if (field === 'updated_at') return; // 무시
              // status는 항상 문자열로 저장
              if (field === 'status') {
                book.status = String(params[idx]);
              } else {
                book[field] = params[idx];
              }
            });
          }
        }
        return Promise.resolve();
      }
      if (query.startsWith('INSERT INTO quotes')) {
        // quotes mock DB
        if (!global.mockQuotes) global.mockQuotes = [];
        const [book_id, content, memo, page, tags] = params;
        const newQuote = {
          id: global.mockQuotes.length + 1,
          book_id,
          content,
          memo,
          page,
          tags
        };
        global.mockQuotes.push(newQuote);
        return Promise.resolve({ lastInsertRowId: newQuote.id });
      }
      if (query.startsWith('INSERT INTO notes')) {
        if (!global.mockNotes) global.mockNotes = [];
        const [book_id, content, tags] = params;
        const newNote = {
          id: global.mockNotes.length + 1,
          book_id,
          content,
          tags
        };
        global.mockNotes.push(newNote);
        return Promise.resolve({ lastInsertRowId: newNote.id });
      }
      if (query.startsWith('INSERT INTO reading_sessions')) {
        if (!global.mockSessions) global.mockSessions = [];
        const [book_id, start_time, end_time, duration_minutes, pages_read, memo] = params;
        const newSession = {
          id: global.mockSessions.length + 1,
          book_id,
          start_time,
          end_time,
          duration_minutes,
          pages_read,
          memo
        };
        global.mockSessions.push(newSession);
        return Promise.resolve({ lastInsertRowId: newSession.id });
      }
      return Promise.resolve();
    }),
  })),
}; 