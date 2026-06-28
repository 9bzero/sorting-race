# sorting-race

Six sorting algorithms racing each other on the same array. It is one thing to know merge sort is O(n log n) and bubble sort is O(n²). It is another to watch bubble sort still grinding away while merge sort finished 3 seconds ago.

## Algorithms

| Algorithm | Avg case | Stable |
|---|---|---|
| Bubble Sort | O(n²) | Yes |
| Selection Sort | O(n²) | No |
| Insertion Sort | O(n²) | Yes |
| Merge Sort | O(n log n) | Yes |
| Quick Sort | O(n log n) | No |
| Heap Sort | O(n log n) | No |

All six algorithms run on the same shuffled array simultaneously. Animation speed and array size are adjustable.

## Features

- Live bar chart for each algorithm
- Color-coded: comparisons are blue, active swaps are red, sorted is green
- Adjustable speed (1x – 20x)
- Array size: 10 – 200 elements
- Shows comparison and swap counts in real time

## Run

```bash
npm install
npm run dev
```