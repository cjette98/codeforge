export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  order: number;
  points: number;
  timeLimit: number; // in minutes
  memoryLimit: string;
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  hints: string[];
  explanation: string;
  concepts: string[];
}

export interface ChallengeProgress {
  challengeId: string;
  isCompleted: boolean;
  attempts: number;
  bestTime?: number;
  completedAt?: Date;
  lastAttempt?: Date;
  code?: string;
}

export const codingChallenges: CodingChallenge[] = [
  // Basic Level Challenges
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'Write a program that prints "Hello, World!" to the console.',
    difficulty: 'Easy',
    category: 'Basics',
    order: 1,
    points: 10,
    timeLimit: 5,
    memoryLimit: '128 MB',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    // Write your code here
    
    return 0;
}`,
    solution: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Hello, World!',
        description: 'Should print Hello, World!'
      }
    ],
    hints: [
      'Use cout to print to the console',
      'Don\'t forget to include the iostream header',
      'Use endl or \\n for a new line'
    ],
    explanation: 'This is the classic first program. Use cout << to output text to the console.',
    concepts: ['Basic I/O', 'cout', 'iostream']
  },
  {
    id: 'add-two-numbers',
    title: 'Add Two Numbers',
    description: 'Write a program that reads two integers and prints their sum.',
    difficulty: 'Easy',
    category: 'Basics',
    order: 2,
    points: 15,
    timeLimit: 10,
    memoryLimit: '128 MB',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    // Read two integers
    cin >> a >> b;
    
    // Calculate and print the sum
    
    return 0;
}`,
    solution: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
    testCases: [
      {
        input: '5 3',
        expectedOutput: '8',
        description: '5 + 3 = 8'
      },
      {
        input: '10 -2',
        expectedOutput: '8',
        description: '10 + (-2) = 8'
      },
      {
        input: '0 0',
        expectedOutput: '0',
        description: '0 + 0 = 0'
      }
    ],
    hints: [
      'Use cin to read input',
      'Store the numbers in variables',
      'Use + operator to add them'
    ],
    explanation: 'Read two integers using cin and output their sum using cout.',
    concepts: ['Input/Output', 'Variables', 'Arithmetic operators']
  },
  {
    id: 'even-odd',
    title: 'Even or Odd',
    description: 'Write a program that determines if a given number is even or odd.',
    difficulty: 'Easy',
    category: 'Conditionals',
    order: 3,
    points: 20,
    timeLimit: 10,
    memoryLimit: '128 MB',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    // Check if n is even or odd and print the result
    
    return 0;
}`,
    solution: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    if (n % 2 == 0) {
        cout << "Even" << endl;
    } else {
        cout << "Odd" << endl;
    }
    
    return 0;
}`,
    testCases: [
      {
        input: '4',
        expectedOutput: 'Even',
        description: '4 is even'
      },
      {
        input: '7',
        expectedOutput: 'Odd',
        description: '7 is odd'
      },
      {
        input: '0',
        expectedOutput: 'Even',
        description: '0 is even'
      }
    ],
    hints: [
      'Use the modulus operator % to check remainder',
      'If n % 2 == 0, the number is even',
      'Use if-else statement for conditional logic'
    ],
    explanation: 'Use the modulus operator to check if a number is divisible by 2.',
    concepts: ['Conditionals', 'Modulus operator', 'If-else statements']
  },
  {
    id: 'factorial',
    title: 'Calculate Factorial',
    description: 'Write a program to calculate the factorial of a given number.',
    difficulty: 'Easy',
    category: 'Loops',
    order: 4,
    points: 25,
    timeLimit: 15,
    memoryLimit: '128 MB',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    // Calculate factorial of n
    
    return 0;
}`,
    solution: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    long long factorial = 1;
    for (int i = 1; i <= n; i++) {
        factorial *= i;
    }
    
    cout << factorial << endl;
    return 0;
}`,
    testCases: [
      {
        input: '5',
        expectedOutput: '120',
        description: '5! = 5 × 4 × 3 × 2 × 1 = 120'
      },
      {
        input: '0',
        expectedOutput: '1',
        description: '0! = 1 by definition'
      },
      {
        input: '3',
        expectedOutput: '6',
        description: '3! = 3 × 2 × 1 = 6'
      }
    ],
    hints: [
      'Use a loop to multiply numbers from 1 to n',
      'Initialize factorial to 1',
      'Remember that 0! = 1'
    ],
    explanation: 'Factorial is the product of all positive integers less than or equal to n.',
    concepts: ['Loops', 'Multiplication', 'Mathematical operations']
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Print the first n numbers in the Fibonacci sequence.',
    difficulty: 'Easy',
    category: 'Loops',
    order: 5,
    points: 30,
    timeLimit: 15,
    memoryLimit: '128 MB',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    // Print first n Fibonacci numbers
    
    return 0;
}`,
    solution: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    if (n >= 1) cout << "0";
    if (n >= 2) cout << " 1";
    
    int a = 0, b = 1;
    for (int i = 3; i <= n; i++) {
        int next = a + b;
        cout << " " << next;
        a = b;
        b = next;
    }
    
    if (n > 0) cout << endl;
    return 0;
}`,
    testCases: [
      {
        input: '5',
        expectedOutput: '0 1 1 2 3',
        description: 'First 5 Fibonacci numbers'
      },
      {
        input: '1',
        expectedOutput: '0',
        description: 'First 1 Fibonacci number'
      },
      {
        input: '8',
        expectedOutput: '0 1 1 2 3 5 8 13',
        description: 'First 8 Fibonacci numbers'
      }
    ],
    hints: [
      'Start with 0 and 1',
      'Each next number is the sum of previous two',
      'Use variables to keep track of the last two numbers'
    ],
    explanation: 'Fibonacci sequence: each number is the sum of the two preceding ones.',
    concepts: ['Loops', 'Sequence generation', 'Variable swapping']
  },
  {
    id: 'prime-check',
    title: 'Prime Number Check',
    description: 'Write a program to check if a given number is prime.',
    difficulty: 'Easy',
    category: 'Loops',
    order: 6,
    points: 35,
    timeLimit: 20,
    memoryLimit: '128 MB',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    // Check if n is prime
    
    return 0;
}`,
    solution: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    if (n <= 1) {
        cout << "Not Prime" << endl;
        return 0;
    }
    
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            cout << "Not Prime" << endl;
            return 0;
        }
    }
    
    cout << "Prime" << endl;
    return 0;
}`,
    testCases: [
      {
        input: '7',
        expectedOutput: 'Prime',
        description: '7 is a prime number'
      },
      {
        input: '4',
        expectedOutput: 'Not Prime',
        description: '4 is not prime (divisible by 2)'
      },
      {
        input: '1',
        expectedOutput: 'Not Prime',
        description: '1 is not considered prime'
      }
    ],
    hints: [
      'A prime number is only divisible by 1 and itself',
      'Check divisibility from 2 to sqrt(n)',
      'Numbers <= 1 are not prime'
    ],
    explanation: 'Check if a number has any divisors other than 1 and itself.',
    concepts: ['Loops', 'Conditionals', 'Mathematical logic']
  },
  {
    id: 'array-sum',
    title: 'Array Sum',
    description: 'Calculate the sum of all elements in an array.',
    difficulty: 'Easy',
    category: 'Arrays',
    order: 7,
    points: 25,
    timeLimit: 15,
    memoryLimit: '128 MB',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    int arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    // Calculate sum of array elements
    
    return 0;
}`,
    solution: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    int arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += arr[i];
    }
    
    cout << sum << endl;
    return 0;
}`,
    testCases: [
      {
        input: '5\n1 2 3 4 5',
        expectedOutput: '15',
        description: 'Sum of [1,2,3,4,5] = 15'
      },
      {
        input: '3\n10 -5 3',
        expectedOutput: '8',
        description: 'Sum of [10,-5,3] = 8'
      },
      {
        input: '1\n42',
        expectedOutput: '42',
        description: 'Sum of [42] = 42'
      }
    ],
    hints: [
      'Use a loop to iterate through the array',
      'Initialize sum to 0',
      'Add each element to the sum'
    ],
    explanation: 'Iterate through the array and accumulate the sum of all elements.',
    concepts: ['Arrays', 'Loops', 'Accumulation']
  },
  {
    id: 'find-maximum',
    title: 'Find Maximum',
    description: 'Find the maximum element in an array.',
    difficulty: 'Easy',
    category: 'Arrays',
    order: 8,
    points: 30,
    timeLimit: 15,
    memoryLimit: '128 MB',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    int arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    // Find maximum element
    
    return 0;
}`,
    solution: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    int arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    
    cout << max << endl;
    return 0;
}`,
    testCases: [
      {
        input: '5\n3 7 2 9 1',
        expectedOutput: '9',
        description: 'Maximum of [3,7,2,9,1] is 9'
      },
      {
        input: '3\n-5 -2 -8',
        expectedOutput: '-2',
        description: 'Maximum of [-5,-2,-8] is -2'
      },
      {
        input: '1\n100',
        expectedOutput: '100',
        description: 'Maximum of [100] is 100'
      }
    ],
    hints: [
      'Initialize max with the first element',
      'Compare each element with current max',
      'Update max if a larger element is found'
    ],
    explanation: 'Iterate through the array and keep track of the largest element seen so far.',
    concepts: ['Arrays', 'Comparison', 'Variable tracking']
  },
  {
    id: 'reverse-array',
    title: 'Reverse Array',
    description: 'Reverse the elements of an array and print them.',
    difficulty: 'Medium',
    category: 'Arrays',
    order: 9,
    points: 35,
    timeLimit: 20,
    memoryLimit: '128 MB',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    int arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    // Reverse and print the array
    
    return 0;
}`,
    solution: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    int arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    for (int i = n - 1; i >= 0; i--) {
        cout << arr[i];
        if (i > 0) cout << " ";
    }
    cout << endl;
    
    return 0;
}`,
    testCases: [
      {
        input: '5\n1 2 3 4 5',
        expectedOutput: '5 4 3 2 1',
        description: 'Reverse of [1,2,3,4,5] is [5,4,3,2,1]'
      },
      {
        input: '3\n10 20 30',
        expectedOutput: '30 20 10',
        description: 'Reverse of [10,20,30] is [30,20,10]'
      },
      {
        input: '1\n42',
        expectedOutput: '42',
        description: 'Reverse of [42] is [42]'
      }
    ],
    hints: [
      'Print elements from last index to first',
      'Use a loop that goes backwards',
      'Handle spacing between elements'
    ],
    explanation: 'Print array elements in reverse order by iterating from the last index to the first.',
    concepts: ['Arrays', 'Reverse iteration', 'Output formatting']
  },
  {
    id: 'palindrome-check',
    title: 'Palindrome Check',
    description: 'Check if a given string is a palindrome.',
    difficulty: 'Medium',
    category: 'Strings',
    order: 10,
    points: 40,
    timeLimit: 20,
    memoryLimit: '128 MB',
    starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    
    // Check if string is palindrome
    
    return 0;
}`,
    solution: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    
    int n = s.length();
    bool isPalindrome = true;
    
    for (int i = 0; i < n / 2; i++) {
        if (s[i] != s[n - 1 - i]) {
            isPalindrome = false;
            break;
        }
    }
    
    if (isPalindrome) {
        cout << "Palindrome" << endl;
    } else {
        cout << "Not Palindrome" << endl;
    }
    
    return 0;
}`,
    testCases: [
      {
        input: 'racecar',
        expectedOutput: 'Palindrome',
        description: 'racecar reads the same forwards and backwards'
      },
      {
        input: 'hello',
        expectedOutput: 'Not Palindrome',
        description: 'hello does not read the same backwards'
      },
      {
        input: 'a',
        expectedOutput: 'Palindrome',
        description: 'Single character is always a palindrome'
      }
    ],
    hints: [
      'Compare characters from both ends',
      'Use two pointers approach',
      'A palindrome reads the same forwards and backwards'
    ],
    explanation: 'Compare characters from the beginning and end, moving towards the center.',
    concepts: ['Strings', 'Two pointers', 'Character comparison']
  },
  {
    id: 'count-vowels',
    title: 'Count Vowels',
    description: 'Count the number of vowels in a given string.',
    difficulty: 'Medium',
    category: 'Strings',
    order: 11,
    points: 35,
    timeLimit: 15,
    memoryLimit: '128 MB',
    starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    
    // Count vowels in the string
    
    return 0;
}`,
    solution: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    
    int count = 0;
    for (int i = 0; i < s.length(); i++) {
        char c = tolower(s[i]);
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            count++;
        }
    }
    
    cout << count << endl;
    return 0;
}`,
    testCases: [
      {
        input: 'hello',
        expectedOutput: '2',
        description: 'hello has 2 vowels: e, o'
      },
      {
        input: 'programming',
        expectedOutput: '3',
        description: 'programming has 3 vowels: o, a, i'
      },
      {
        input: 'xyz',
        expectedOutput: '0',
        description: 'xyz has no vowels'
      }
    ],
    hints: [
      'Vowels are a, e, i, o, u',
      'Consider both uppercase and lowercase',
      'Use a loop to check each character'
    ],
    explanation: 'Iterate through the string and count characters that are vowels.',
    concepts: ['Strings', 'Character checking', 'Case handling']
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    description: 'Implement bubble sort to sort an array in ascending order.',
    difficulty: 'Medium',
    category: 'Sorting',
    order: 12,
    points: 45,
    timeLimit: 25,
    memoryLimit: '128 MB',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    int arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    // Implement bubble sort
    
    // Print sorted array
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    
    return 0;
}`,
    solution: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    int arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    // Bubble sort
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    
    // Print sorted array
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    
    return 0;
}`,
    testCases: [
      {
        input: '5\n64 34 25 12 22',
        expectedOutput: '12 22 25 34 64',
        description: 'Sort [64,34,25,12,22] in ascending order'
      },
      {
        input: '3\n3 1 2',
        expectedOutput: '1 2 3',
        description: 'Sort [3,1,2] in ascending order'
      },
      {
        input: '1\n42',
        expectedOutput: '42',
        description: 'Single element array remains the same'
      }
    ],
    hints: [
      'Compare adjacent elements',
      'Swap if they are in wrong order',
      'Repeat until no swaps are needed'
    ],
    explanation: 'Bubble sort repeatedly compares adjacent elements and swaps them if they are in the wrong order.',
    concepts: ['Sorting algorithms', 'Nested loops', 'Element swapping']
  }
];