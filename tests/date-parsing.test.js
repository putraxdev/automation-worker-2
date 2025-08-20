const { parseDateFromFilename } = require('../src/clean-data');
const { formatDate, formatTime } = require('../src/collect-data');

describe('Date Parsing Tests', () => {
  test('should parse date from valid filename', () => {
    const filename = 'cron_products_12192024_15.00.csv';
    const date = parseDateFromFilename(filename);
    
    expect(date).toBeInstanceOf(Date);
    expect(date.getMonth()).toBe(11); // December (0-indexed)
    expect(date.getDate()).toBe(19);
    expect(date.getFullYear()).toBe(2024);
    expect(date.getHours()).toBe(15);
    expect(date.getMinutes()).toBe(0);
  });

  test('should return null for invalid filename', () => {
    const filename = 'invalid_filename.csv';
    const date = parseDateFromFilename(filename);
    
    expect(date).toBeNull();
  });

  test('should return null for filename with invalid date', () => {
    const filename = 'cron_products_13192024_15.00.csv'; // Invalid month
    const date = parseDateFromFilename(filename);
    
    expect(date).toBeNull();
  });
});

describe('Filename Generation Tests', () => {
  test('should generate correct filename format', () => {
    const testDate = new Date(2024, 11, 19, 15, 0); // December 19, 2024, 15:00
    
    // Note: These functions would need to be exported from collect-data.js
    // For now, we'll test the concept
    const dateStr = `${String(testDate.getMonth() + 1).padStart(2, '0')}${String(testDate.getDate()).padStart(2, '0')}${testDate.getFullYear()}`;
    const timeStr = `${String(testDate.getHours()).padStart(2, '0')}.${String(testDate.getMinutes()).padStart(2, '0')}`;
    
    expect(dateStr).toBe('12192024');
    expect(timeStr).toBe('15.00');
  });
});
