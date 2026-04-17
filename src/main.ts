// Cinema Seat Reservation System (Command-Line, Interactive)
// Assignment: Use only arrays and functions (no objects/classes)
// 8 rows x 10 columns, 0 = available, 1 = occupied

import readline from 'readline';

// Initializes an 8x10 seating matrix with all seats available (0)
function initializeSeating(): number[][] {
  const rows = 8;
  const cols = 10;
  const seating = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(0);
    }
    seating.push(row);
  }
  return seating;
}

// Displays the seating chart in the console
function displaySeating(seating: number[][]): void {
  console.log('\nCurrent Seating Chart:');
  // Print column headers with two spaces for each column
  let header = '            ';
  for (let col = 0; col < seating[0].length; col++) {
    header += (col + 1).toString().padStart(3, ' ');
  }
  console.log(header);
  for (let row = 0; row < seating.length; row++) {
    // 11 spaces after colon to align with header (7 for 'Row X:' + 4 more)
    let rowStr = 'Row ' + (row + 1).toString().padStart(2, ' ') + ':';
    rowStr = rowStr.padEnd(12, ' ');
    for (let col = 0; col < seating[row].length; col++) {
      rowStr += '  ' + (seating[row][col] === 1 ? 'X' : 'L');
    }
    console.log(rowStr);
  }
}

// Reserves a seat if available, returns a message
function reserveSeat(seating: number[][], row: number, col: number): string {
  if (row < 1 || row > 8 || col < 1 || col > 10) {
    return 'Invalid seat position. Please enter a valid row (1-8) and column (1-10).';
  }
  if (seating[row - 1][col - 1] === 1) {
    return `Seat Row ${row}, Column ${col} is already occupied.`;
  }
  seating[row - 1][col - 1] = 1;
  return `Reservation confirmed for Row ${row}, Column ${col}.`;
}

// Counts occupied and available seats
function countSeats(seating: number[][]): { occupied: number, available: number } {
  let occupied = 0;
  let available = 0;
  for (let row = 0; row < seating.length; row++) {
    for (let col = 0; col < seating[row].length; col++) {
      if (seating[row][col] === 1) occupied++;
      else available++;
    }
  }
  return { occupied, available };
}

// Finds the first pair of adjacent available seats in any row
function findAdjacentSeats(seating: number[][]): { row: number, col1: number, col2: number } | null {
  for (let row = 0; row < seating.length; row++) {
    for (let col = 0; col < seating[row].length - 1; col++) {
      if (seating[row][col] === 0 && seating[row][col + 1] === 0) {
        return { row: row + 1, col1: col + 1, col2: col + 2 };
      }
    }
  }
  return null;
}

// Interactive CLI
function main() {
  let seating = initializeSeating();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function showMenu() {
    console.log('\n--- Cinema Seat Reservation System ---');
    console.log('1. Display seating chart');
    console.log('2. Reserve a seat');
    console.log('3. Count occupied and available seats');
    console.log('4. Find two adjacent available seats');
    console.log('5. Exit');
    rl.question('Choose an option (1-5): ', handleMenu);
  }

  function handleMenu(option: string) {
    switch (option.trim()) {
      case '1':
        displaySeating(seating);
        showMenu();
        break;
      case '2':
        rl.question('Enter row number (1-8): ', (rowStr) => {
          rl.question('Enter column number (1-10): ', (colStr) => {
            const row = parseInt(rowStr);
            const col = parseInt(colStr);
            const msg = reserveSeat(seating, row, col);
            console.log(msg);
            showMenu();
          });
        });
        break;
      case '3':
        const counts = countSeats(seating);
        console.log(`Occupied seats: ${counts.occupied}`);
        console.log(`Available seats: ${counts.available}`);
        showMenu();
        break;
      case '4':
        const pair = findAdjacentSeats(seating);
        if (pair) {
          console.log(`First adjacent available seats: Row ${pair.row}, Columns ${pair.col1} & ${pair.col2}`);
        } else {
          console.log('No adjacent available seats found.');
        }
        showMenu();
        break;
      case '5':
        console.log('Exiting. Thank you!');
        rl.close();
        break;
      default:
        console.log('Invalid option. Please choose 1-5.');
        showMenu();
    }
  }

  showMenu();
}

main();
