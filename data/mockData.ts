export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  estimatedTime: number;
  order: number;
  sectionId: string;
  preTest: Question[];
  postTest: Question[];
}

export interface Section {
  id: string;
  title: string;
  description: string;
  color: string;
  order: number;
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'student@example.com',
    password: 'password123',
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  },
  {
    id: '2',
    email: 'jane@example.com',
    password: 'password123',
    name: 'Jane Smith',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  }
];

export const sections: Section[] = [
  {
    id: 'basics',
    title: 'C++ Basics',
    description: 'Learn the fundamentals of C++ programming',
    color: '#3B82F6',
    order: 1
  },
  {
    id: 'control-structures',
    title: 'Control Structures',
    description: 'Master loops, conditionals, and decision making',
    color: '#10B981',
    order: 2
  },
  {
    id: 'functions',
    title: 'Functions',
    description: 'Understand function declaration, definition, and usage',
    color: '#F59E0B',
    order: 3
  },
  {
    id: 'oop',
    title: 'Object-Oriented Programming',
    description: 'Learn classes, objects, inheritance, and polymorphism',
    color: '#8B5CF6',
    order: 4
  }
];

export const lessons: Lesson[] = [
  // C++ Basics Section
  {
    id: 'intro-cpp',
    title: 'Introduction to C++',
    description: 'Learn what C++ is and its basic syntax',
    content: `C++ is a general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language. It was originally named "C with Classes" but was later renamed C++ in 1983.

  Key features of C++:
  - Object-oriented programming support
  - Low-level memory manipulation
  - Rich library support
  - Platform independent
  - Case-sensitive language

  Basic C++ Program Structure:
  \`\`\`cpp
  #include <iostream>
  using namespace std;

  int main() {
      cout << "Hello, World!" << endl;
      return 0;
  }
  \`\`\`

  The #include directive tells the preprocessor to include the contents of another file. The iostream library provides input/output functionality.`,
    videoUrl: 'https://www.youtube.com/watch?v=s0g4ty29Xgg',
    estimatedTime: 30,
    order: 1,
    sectionId: 'basics',
    preTest: [
      {
        id: 'intro-pre-1',
        question: 'Who created the C++ programming language?',
        options: ['Dennis Ritchie', 'Bjarne Stroustrup', 'James Gosling', 'Guido van Rossum'],
        correctAnswer: 1,
        explanation: 'Bjarne Stroustrup created C++ as an extension of the C programming language.'
      },
      {
        id: 'intro-pre-2',
        question: 'What was C++ originally called?',
        options: ['C with Classes', 'Advanced C', 'C Plus', 'Object C'],
        correctAnswer: 0,
        explanation: 'C++ was originally named "C with Classes" before being renamed to C++ in 1983.'
      },
      {
        id: 'intro-pre-3',
        question: 'Which header file is needed for input/output operations in C++?',
        options: ['<stdio.h>', '<iostream>', '<conio.h>', '<fstream>'],
        correctAnswer: 1,
        explanation: 'The <iostream> header file provides input/output functionality in C++.'
      }
    ],
    postTest: [
      {
        id: 'intro-post-1',
        question: 'What does the #include directive do in C++?',
        options: ['Defines a function', 'Includes another file', 'Declares a variable', 'Creates a class'],
        correctAnswer: 1,
        explanation: 'The #include directive tells the preprocessor to include the contents of another file.'
      },
      {
        id: 'intro-post-2',
        question: 'What is the correct way to output text in C++?',
        options: ['print("Hello")', 'cout << "Hello"', 'printf("Hello")', 'echo "Hello"'],
        correctAnswer: 1,
        explanation: 'cout << is the standard way to output text in C++.'
      },
      {
        id: 'intro-post-3',
        question: 'What does "using namespace std;" do?',
        options: ['Creates a namespace', 'Imports all std functions', 'Defines standard library', 'Allows using std without prefix'],
        correctAnswer: 3,
        explanation: 'It allows you to use standard library functions without the std:: prefix.'
      }
    ]
  },
  {
    id: 'variables-datatypes',
    title: 'Variables and Data Types',
    description: 'Understand different data types and variable declaration',
    content: `Variables are containers for storing data values. In C++, every variable has a data type that determines what kind of data it can store.

  Basic Data Types:
  - int: Integer numbers (4 bytes)
  - float: Floating point numbers (4 bytes)
  - double: Double precision floating point (8 bytes)
  - char: Single character (1 byte)
  - bool: Boolean values (true/false)
  - string: Sequence of characters

  Variable Declaration:
  \`\`\`cpp
  int age = 25;
  float height = 5.9;
  double salary = 50000.50;
  char grade = 'A';
  bool isStudent = true;
  string name = "John";
  \`\`\`

  Constants:
  \`\`\`cpp
  const int MAX_SIZE = 100;
  const double PI = 3.14159;
  \`\`\``,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    estimatedTime: 45,
    order: 2,
    sectionId: 'basics',
    preTest: [
      {
        id: 'var-pre-1',
        question: 'Which data type is used to store whole numbers in C++?',
        options: ['float', 'int', 'char', 'string'],
        correctAnswer: 1,
        explanation: 'The int data type is used to store whole numbers (integers) in C++.'
      },
      {
        id: 'var-pre-2',
        question: 'How many bytes does a char data type typically occupy?',
        options: ['1 byte', '2 bytes', '4 bytes', '8 bytes'],
        correctAnswer: 0,
        explanation: 'A char data type typically occupies 1 byte of memory.'
      },
      {
        id: 'var-pre-3',
        question: 'What keyword is used to declare a constant in C++?',
        options: ['final', 'const', 'static', 'readonly'],
        correctAnswer: 1,
        explanation: 'The const keyword is used to declare constants in C++.'
      }
    ],
    postTest: [
      {
        id: 'var-post-1',
        question: 'Which is the correct way to declare an integer variable?',
        options: ['integer x = 5;', 'int x = 5;', 'number x = 5;', 'var x = 5;'],
        correctAnswer: 1,
        explanation: 'int x = 5; is the correct syntax to declare an integer variable in C++.'
      },
      {
        id: 'var-post-2',
        question: 'What is the difference between float and double?',
        options: ['No difference', 'float is larger', 'double has more precision', 'float is faster'],
        correctAnswer: 2,
        explanation: 'double has more precision (8 bytes) compared to float (4 bytes).'
      },
      {
        id: 'var-post-3',
        question: 'Which data type would you use to store true/false values?',
        options: ['int', 'char', 'bool', 'string'],
        correctAnswer: 2,
        explanation: 'The bool data type is specifically designed to store true/false values.'
      }
    ]
  },
  {
    id: 'operators',
    title: 'Operators in C++',
    description: 'Learn about arithmetic, logical, and comparison operators',
    content: `Operators are symbols that perform operations on variables and values. C++ has several types of operators:

  Arithmetic Operators:
  - + (Addition)
  - - (Subtraction)
  - * (Multiplication)
  - / (Division)
  - % (Modulus)

  Comparison Operators:
  - == (Equal to)
  - != (Not equal to)
  - > (Greater than)
  - < (Less than)
  - >= (Greater than or equal to)
  - <= (Less than or equal to)

  Logical Operators:
  - && (AND)
  - || (OR)
  - ! (NOT)

  Assignment Operators:
  - = (Assignment)
  - += (Add and assign)
  - -= (Subtract and assign)
  - *= (Multiply and assign)
  - /= (Divide and assign)

  Example:
  \`\`\`cpp
  int a = 10, b = 5;
  int sum = a + b;        // 15
  bool result = a > b;    // true
  a += 3;                 // a becomes 13
  \`\`\``,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    estimatedTime: 40,
    order: 3,
    sectionId: 'basics',
    preTest: [
      {
        id: 'op-pre-1',
        question: 'What does the % operator do in C++?',
        options: ['Percentage calculation', 'Modulus (remainder)', 'Division', 'Multiplication'],
        correctAnswer: 1,
        explanation: 'The % operator returns the remainder of a division operation (modulus).'
      },
      {
        id: 'op-pre-2',
        question: 'Which operator is used to check if two values are equal?',
        options: ['=', '==', '!=', '==='],
        correctAnswer: 1,
        explanation: 'The == operator is used to check if two values are equal in C++.'
      },
      {
        id: 'op-pre-3',
        question: 'What is the result of 10 % 3 in C++?',
        options: ['3', '1', '0', '10'],
        correctAnswer: 1,
        explanation: '10 % 3 returns 1, which is the remainder when 10 is divided by 3.'
      }
    ],
    postTest: [
      {
        id: 'op-post-1',
        question: 'What does the += operator do?',
        options: ['Adds two numbers', 'Assigns a value', 'Adds and assigns', 'Compares values'],
        correctAnswer: 2,
        explanation: 'The += operator adds the right operand to the left operand and assigns the result to the left operand.'
      },
      {
        id: 'op-post-2',
        question: 'Which logical operator represents AND in C++?',
        options: ['&', '&&', '||', '!'],
        correctAnswer: 1,
        explanation: 'The && operator represents logical AND in C++.'
      },
      {
        id: 'op-post-3',
        question: 'What is the result of (5 > 3) && (2 < 4)?',
        options: ['true', 'false', '1', '0'],
        correctAnswer: 0,
        explanation: 'Both conditions are true, so the AND operation returns true.'
      }
    ]
  },

  // Control Structures Section
  {
    id: 'if-else',
    title: 'If-Else Statements',
    description: 'Learn conditional programming with if-else statements',
    content: `Conditional statements allow your program to make decisions based on certain conditions.

  Basic If Statement:
  \`\`\`cpp
  if (condition) {
      // code to execute if condition is true
  }
  \`\`\`

  If-Else Statement:
  \`\`\`cpp
  if (condition) {
      // code if condition is true
  } else {
      // code if condition is false
  }
  \`\`\`

  If-Else If-Else:
  \`\`\`cpp
  if (condition1) {
      // code for condition1
  } else if (condition2) {
      // code for condition2
  } else {
      // code if no condition is true
  }
  \`\`\`

  Example:
  \`\`\`cpp
  int score = 85;
  if (score >= 90) {
      cout << "Grade A";
  } else if (score >= 80) {
      cout << "Grade B";
  } else if (score >= 70) {
      cout << "Grade C";
  } else {
      cout << "Grade F";
  }
  \`\`\``,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    estimatedTime: 35,
    order: 1,
    sectionId: 'control-structures',
    preTest: [
      {
        id: 'if-pre-1',
        question: 'What is the purpose of an if statement?',
        options: ['To repeat code', 'To make decisions', 'To define functions', 'To declare variables'],
        correctAnswer: 1,
        explanation: 'If statements are used to make decisions and execute code conditionally.'
      },
      {
        id: 'if-pre-2',
        question: 'Which keyword is used for alternative execution in C++?',
        options: ['elif', 'else', 'otherwise', 'alternate'],
        correctAnswer: 1,
        explanation: 'The else keyword is used for alternative execution when the if condition is false.'
      },
      {
        id: 'if-pre-3',
        question: 'What happens if an if condition evaluates to false and there is no else?',
        options: ['Error occurs', 'Program stops', 'Code inside if is skipped', 'Default code runs'],
        correctAnswer: 2,
        explanation: 'If the condition is false and there is no else, the code inside the if block is simply skipped.'
      }
    ],
    postTest: [
      {
        id: 'if-post-1',
        question: 'What is the correct syntax for an if-else statement?',
        options: ['if (condition) {} else {}', 'if condition {} else {}', 'if (condition): else:', 'if condition then else'],
        correctAnswer: 0,
        explanation: 'The correct syntax is if (condition) {} else {} with parentheses around the condition.'
      },
      {
        id: 'if-post-2',
        question: 'How many else if statements can you have?',
        options: ['Only one', 'Maximum 5', 'No limit', 'Only two'],
        correctAnswer: 2,
        explanation: 'You can have as many else if statements as needed in C++.'
      },
      {
        id: 'if-post-3',
        question: 'What will be printed if x = 15?\nif (x > 10) cout << "A"; else if (x > 5) cout << "B"; else cout << "C";',
        options: ['A', 'B', 'C', 'AB'],
        correctAnswer: 0,
        explanation: 'Since x > 10 is true, "A" will be printed and the rest will be skipped.'
      }
    ]
  },
  {
    id: 'loops',
    title: 'Loops in C++',
    description: 'Master for, while, and do-while loops',
    content: `Loops allow you to execute a block of code repeatedly.

  For Loop:
  \`\`\`cpp
  for (initialization; condition; increment) {
      // code to repeat
  }

  // Example
  for (int i = 0; i < 5; i++) {
      cout << i << " ";
  }
  \`\`\`

  While Loop:
  \`\`\`cpp
  while (condition) {
      // code to repeat
  }

  // Example
  int i = 0;
  while (i < 5) {
      cout << i << " ";
      i++;
  }
  \`\`\`

  Do-While Loop:
  \`\`\`cpp
  do {
      // code to repeat
  } while (condition);

  // Example
  int i = 0;
  do {
      cout << i << " ";
      i++;
  } while (i < 5);
  \`\`\`

  Loop Control:
  - break: Exit the loop
  - continue: Skip current iteration`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    estimatedTime: 50,
    order: 2,
    sectionId: 'control-structures',
    preTest: [
      {
        id: 'loop-pre-1',
        question: 'What is the main purpose of loops in programming?',
        options: ['To make decisions', 'To repeat code', 'To define functions', 'To store data'],
        correctAnswer: 1,
        explanation: 'Loops are used to repeat a block of code multiple times.'
      },
      {
        id: 'loop-pre-2',
        question: 'Which loop executes at least once regardless of the condition?',
        options: ['for loop', 'while loop', 'do-while loop', 'if loop'],
        correctAnswer: 2,
        explanation: 'Do-while loop executes the code block at least once before checking the condition.'
      },
      {
        id: 'loop-pre-3',
        question: 'What keyword is used to exit a loop prematurely?',
        options: ['exit', 'break', 'stop', 'end'],
        correctAnswer: 1,
        explanation: 'The break keyword is used to exit a loop prematurely.'
      }
    ],
    postTest: [
      {
        id: 'loop-post-1',
        question: 'What is the correct syntax for a for loop?',
        options: ['for (init; condition; increment)', 'for init; condition; increment', 'for (init, condition, increment)', 'for init, condition, increment'],
        correctAnswer: 0,
        explanation: 'The correct syntax is for (initialization; condition; increment) with semicolons.'
      },
      {
        id: 'loop-post-2',
        question: 'How many times will this loop run?\nfor (int i = 1; i <= 3; i++)',
        options: ['2 times', '3 times', '4 times', 'Infinite'],
        correctAnswer: 1,
        explanation: 'The loop runs for i = 1, 2, and 3, so it runs 3 times.'
      },
      {
        id: 'loop-post-3',
        question: 'What does the continue statement do in a loop?',
        options: ['Exits the loop', 'Skips current iteration', 'Restarts the loop', 'Pauses the loop'],
        correctAnswer: 1,
        explanation: 'The continue statement skips the rest of the current iteration and moves to the next one.'
      }
    ]
  },
  {
    id: 'switch-case',
    title: 'Switch-Case Statements',
    description: 'Learn multi-way branching with switch statements',
    content: `Switch statements provide a way to execute different code blocks based on the value of a variable.

  Basic Switch Statement:
  \`\`\`cpp
  switch (variable) {
      case value1:
          // code for value1
          break;
      case value2:
          // code for value2
          break;
      default:
          // code if no case matches
          break;
  }
  \`\`\`

  Example:
  \`\`\`cpp
  int day = 3;
  switch (day) {
      case 1:
          cout << "Monday";
          break;
      case 2:
          cout << "Tuesday";
          break;
      case 3:
          cout << "Wednesday";
          break;
      case 4:
          cout << "Thursday";
          break;
      case 5:
          cout << "Friday";
          break;
      default:
          cout << "Weekend";
          break;
  }
  \`\`\`

  Important Notes:
  - Each case must end with break (unless fall-through is intended)
  - Default case is optional but recommended
  - Switch works with integers, characters, and enums`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    estimatedTime: 30,
    order: 3,
    sectionId: 'control-structures',
    preTest: [
      {
        id: 'switch-pre-1',
        question: 'What is the purpose of a switch statement?',
        options: ['To repeat code', 'To make multiple decisions', 'To define variables', 'To create functions'],
        correctAnswer: 1,
        explanation: 'Switch statements are used to make multiple decisions based on the value of a variable.'
      },
      {
        id: 'switch-pre-2',
        question: 'What keyword is used to prevent fall-through in switch cases?',
        options: ['stop', 'break', 'exit', 'end'],
        correctAnswer: 1,
        explanation: 'The break keyword prevents fall-through and exits the switch statement.'
      },
      {
        id: 'switch-pre-3',
        question: 'Which case executes when no other case matches?',
        options: ['else case', 'default case', 'final case', 'catch case'],
        correctAnswer: 1,
        explanation: 'The default case executes when no other case matches the switch variable.'
      }
    ],
    postTest: [
      {
        id: 'switch-post-1',
        question: 'What happens if you forget to put break in a case?',
        options: ['Compilation error', 'Runtime error', 'Fall-through occurs', 'Nothing happens'],
        correctAnswer: 2,
        explanation: 'Without break, execution falls through to the next case (fall-through behavior).'
      },
      {
        id: 'switch-post-2',
        question: 'Which data types can be used with switch statements?',
        options: ['Only integers', 'Only characters', 'Integers and characters', 'All data types'],
        correctAnswer: 2,
        explanation: 'Switch statements work with integers, characters, and enumerated types.'
      },
      {
        id: 'switch-post-3',
        question: 'Is the default case mandatory in a switch statement?',
        options: ['Yes, always required', 'No, but recommended', 'Only for integers', 'Only for characters'],
        correctAnswer: 1,
        explanation: 'The default case is optional but recommended for handling unexpected values.'
      }
    ]
  },

  // Functions Section
  {
    id: 'function-basics',
    title: 'Function Basics',
    description: 'Learn to create and use functions in C++',
    content: `Functions are blocks of code that perform specific tasks and can be reused throughout your program.

  Function Declaration:
  \`\`\`cpp
  return_type function_name(parameters);
  \`\`\`

  Function Definition:
  \`\`\`cpp
  return_type function_name(parameters) {
      // function body
      return value; // if return_type is not void
  }
  \`\`\`

  Example:
  \`\`\`cpp
  // Function declaration
  int add(int a, int b);

  // Function definition
  int add(int a, int b) {
      return a + b;
  }

  // Function call
  int main() {
      int result = add(5, 3);
      cout << result; // Output: 8
      return 0;
  }
  \`\`\`

  Function Types:
  - Void functions (no return value)
  - Value-returning functions
  - Functions with parameters
  - Functions without parameters`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    estimatedTime: 45,
    order: 1,
    sectionId: 'functions',
    preTest: [
      {
        id: 'func-pre-1',
        question: 'What is a function in programming?',
        options: ['A variable', 'A reusable block of code', 'A data type', 'A loop'],
        correctAnswer: 1,
        explanation: 'A function is a reusable block of code that performs a specific task.'
      },
      {
        id: 'func-pre-2',
        question: 'What keyword is used to return a value from a function?',
        options: ['give', 'return', 'send', 'output'],
        correctAnswer: 1,
        explanation: 'The return keyword is used to return a value from a function.'
      },
      {
        id: 'func-pre-3',
        question: 'What does void mean in a function declaration?',
        options: ['Function has parameters', 'Function returns nothing', 'Function is empty', 'Function is private'],
        correctAnswer: 1,
        explanation: 'void means the function does not return any value.'
      }
    ],
    postTest: [
      {
        id: 'func-post-1',
        question: 'What is the correct way to declare a function that returns an integer?',
        options: ['function int myFunc()', 'int myFunc()', 'return int myFunc()', 'integer myFunc()'],
        correctAnswer: 1,
        explanation: 'int myFunc() is the correct syntax to declare a function that returns an integer.'
      },
      {
        id: 'func-post-2',
        question: 'Where should function declarations typically be placed?',
        options: ['After main()', 'Before main()', 'Inside main()', 'At the end of file'],
        correctAnswer: 1,
        explanation: 'Function declarations should be placed before main() or before they are called.'
      },
      {
        id: 'func-post-3',
        question: 'What happens if you call a function without providing required parameters?',
        options: ['Default values are used', 'Compilation error', 'Runtime error', 'Function returns 0'],
        correctAnswer: 1,
        explanation: 'If required parameters are not provided, it results in a compilation error.'
      }
    ]
  },
  {
    id: 'function-parameters',
    title: 'Function Parameters',
    description: 'Understand parameter passing and function overloading',
    content: `Functions can accept parameters to make them more flexible and reusable.

  Parameter Types:
  1. Pass by Value
  2. Pass by Reference
  3. Pass by Pointer

  Pass by Value:
  \`\`\`cpp
  void func(int x) {
      x = 10; // Original value unchanged
  }
  \`\`\`

  Pass by Reference:
  \`\`\`cpp
  void func(int &x) {
      x = 10; // Original value changed
  }
  \`\`\`

  Default Parameters:
  \`\`\`cpp
  int multiply(int a, int b = 1) {
      return a * b;
  }

  // Can be called as:
  multiply(5);    // Uses default b = 1
  multiply(5, 3); // Uses b = 3
  \`\`\`

  Function Overloading:
  \`\`\`cpp
  int add(int a, int b) {
      return a + b;
  }

  double add(double a, double b) {
      return a + b;
  }
  \`\`\``,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    estimatedTime: 40,
    order: 2,
    sectionId: 'functions',
    preTest: [
      {
        id: 'param-pre-1',
        question: 'What is pass by value?',
        options: ['Passing the variable address', 'Passing a copy of the value', 'Passing the variable name', 'Passing a reference'],
        correctAnswer: 1,
        explanation: 'Pass by value means passing a copy of the value, so the original variable is not modified.'
      },
      {
        id: 'param-pre-2',
        question: 'What symbol is used for pass by reference in C++?',
        options: ['*', '&', '#', '@'],
        correctAnswer: 1,
        explanation: 'The & symbol is used for pass by reference in C++.'
      },
      {
        id: 'param-pre-3',
        question: 'What is function overloading?',
        options: ['Using too many functions', 'Functions with same name but different parameters', 'Functions that call themselves', 'Functions with no parameters'],
        correctAnswer: 1,
        explanation: 'Function overloading allows multiple functions with the same name but different parameters.'
      }
    ],
    postTest: [
      {
        id: 'param-post-1',
        question: 'When should you use pass by reference?',
        options: ['When you want to modify the original value', 'When you want to copy the value', 'When you want to hide the value', 'When you want to delete the value'],
        correctAnswer: 0,
        explanation: 'Pass by reference is used when you want to modify the original variable.'
      },
      {
        id: 'param-post-2',
        question: 'What are default parameters?',
        options: ['Parameters that are always zero', 'Parameters with predefined values', 'Parameters that are required', 'Parameters that are hidden'],
        correctAnswer: 1,
        explanation: 'Default parameters have predefined values that are used if no argument is provided.'
      },
      {
        id: 'param-post-3',
        question: 'Can you overload functions based only on return type?',
        options: ['Yes, always', 'No, never', 'Only with void functions', 'Only with integer functions'],
        correctAnswer: 1,
        explanation: 'Functions cannot be overloaded based solely on return type; parameters must differ.'
      }
    ]
  },
  {
    id: 'recursion',
    title: 'Recursion',
    description: 'Learn recursive functions and their applications',
    content: `Recursion is a programming technique where a function calls itself to solve a problem.

  Basic Recursion Structure:
  \`\`\`cpp
  return_type recursive_function(parameters) {
      // Base case
      if (base_condition) {
          return base_value;
      }

      // Recursive case
      return recursive_function(modified_parameters);
  }
  \`\`\`

  Example - Factorial:
  \`\`\`cpp
  int factorial(int n) {
      // Base case
      if (n <= 1) {
          return 1;
      }

      // Recursive case
      return n * factorial(n - 1);
  }
  \`\`\`

  Example - Fibonacci:
  \`\`\`cpp
  int fibonacci(int n) {
      if (n <= 1) {
          return n;
      }
      return fibonacci(n - 1) + fibonacci(n - 2);
  }
  \`\`\`

  Important Points:
  - Must have a base case to stop recursion
  - Each recursive call should move toward the base case
  - Can be memory intensive due to function call stack`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    estimatedTime: 50,
    order: 3,
    sectionId: 'functions',
    preTest: [
      {
        id: 'rec-pre-1',
        question: 'What is recursion?',
        options: ['A loop that never ends', 'A function calling itself', 'A function with no parameters', 'A function that returns void'],
        correctAnswer: 1,
        explanation: 'Recursion is when a function calls itself to solve a problem.'
      },
      {
        id: 'rec-pre-2',
        question: 'What is a base case in recursion?',
        options: ['The first function call', 'The condition to stop recursion', 'The main function', 'The return statement'],
        correctAnswer: 1,
        explanation: 'A base case is the condition that stops the recursive calls.'
      },
      {
        id: 'rec-pre-3',
        question: 'What happens if a recursive function has no base case?',
        options: ['It returns 0', 'It causes infinite recursion', 'It works normally', 'It returns null'],
        correctAnswer: 1,
        explanation: 'Without a base case, the function will call itself infinitely, causing a stack overflow.'
      }
    ],
    postTest: [
      {
        id: 'rec-post-1',
        question: 'What is the factorial of 5 using recursion?',
        options: ['15', '25', '120', '100'],
        correctAnswer: 2,
        explanation: 'factorial(5) = 5 * 4 * 3 * 2 * 1 = 120'
      },
      {
        id: 'rec-post-2',
        question: 'Which is more memory efficient for large inputs?',
        options: ['Recursion', 'Iteration', 'Both are same', 'Depends on the problem'],
        correctAnswer: 1,
        explanation: 'Iteration is generally more memory efficient as it does not use the function call stack.'
      },
      {
        id: 'rec-post-3',
        question: 'What is the base case for calculating factorial?',
        options: ['n = 0', 'n <= 1', 'n > 1', 'n = 1'],
        correctAnswer: 1,
        explanation: 'The base case for factorial is typically n <= 1, returning 1.'
      }
    ]
  },

  // Object-Oriented Programming Section
  {
    id: 'classes-objects',
    title: 'Classes and Objects',
    description: 'Introduction to object-oriented programming concepts',
    content: `Object-Oriented Programming (OOP) is a programming paradigm based on the concept of objects, which contain data (attributes) and code (methods).

  Class Definition:
  \`\`\`cpp
  class ClassName {
  private:
      // Private members
      int privateVar;

  public:
      // Public members
      int publicVar;

      // Constructor
      ClassName() {
          privateVar = 0;
          publicVar = 0;
      }

      // Methods
      void setPrivateVar(int value) {
          privateVar = value;
      }

      int getPrivateVar() {
          return privateVar;
      }
  };
  \`\`\`

  Creating Objects:
  \`\`\`cpp
  ClassName obj1;           // Default constructor
  ClassName obj2();         // Also calls default constructor
  ClassName* obj3 = new ClassName(); // Dynamic allocation
  \`\`\`

  Accessing Members:
  \`\`\`cpp
  obj1.publicVar = 10;
  obj1.setPrivateVar(5);
  int value = obj1.getPrivateVar();
  \`\`\``,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    estimatedTime: 60,
    order: 1,
    sectionId: 'oop',
    preTest: [
      {
        id: 'class-pre-1',
        question: 'What is a class in C++?',
        options: ['A function', 'A blueprint for objects', 'A variable', 'A loop'],
        correctAnswer: 1,
        explanation: 'A class is a blueprint or template for creating objects.'
      },
      {
        id: 'class-pre-2',
        question: 'What is an object?',
        options: ['A class definition', 'An instance of a class', 'A function', 'A variable type'],
        correctAnswer: 1,
        explanation: 'An object is an instance of a class, created from the class blueprint.'
      },
      {
        id: 'class-pre-3',
        question: 'What are the main access specifiers in C++?',
        options: ['public, protected, private', 'open, closed, hidden', 'visible, invisible, secret', 'read, write, execute'],
        correctAnswer: 0,
        explanation: 'The main access specifiers in C++ are public, protected, and private.'
      }
    ],
    postTest: [
      {
        id: 'class-post-1',
        question: 'What is the difference between a class and an object?',
        options: ['No difference', 'Class is template, object is instance', 'Object is template, class is instance', 'They are the same thing'],
        correctAnswer: 1,
        explanation: 'A class is a template or blueprint, while an object is an instance created from that class.'
      },
      {
        id: 'class-post-2',
        question: 'Which access specifier allows access from outside the class?',
        options: ['private', 'protected', 'public', 'internal'],
        correctAnswer: 2,
        explanation: 'Public members can be accessed from outside the class.'
      },
      {
        id: 'class-post-3',
        question: 'What is a constructor?',
        options: ['A function that destroys objects', 'A function that initializes objects', 'A function that copies objects', 'A function that compares objects'],
        correctAnswer: 1,
        explanation: 'A constructor is a special function that initializes objects when they are created.'
      }
    ]
  },
  {
    id: 'inheritance',
    title: 'Inheritance',
    description: 'Learn about inheritance and code reusability',
    content: `Inheritance allows a class to inherit properties and methods from another class, promoting code reusability.

  Basic Inheritance:
  \`\`\`cpp
  // Base class
  class Animal {
  protected:
      string name;

  public:
      Animal(string n) : name(n) {}

      void eat() {
          cout << name << " is eating" << endl;
      }

      virtual void makeSound() {
          cout << "Some generic animal sound" << endl;
      }
  };

  // Derived class
  class Dog : public Animal {
  public:
      Dog(string n) : Animal(n) {}

      void makeSound() override {
          cout << name << " says Woof!" << endl;
      }

      void wagTail() {
          cout << name << " is wagging tail" << endl;
      }
  };
  \`\`\`

  Types of Inheritance:
  - Single Inheritance: One base class
  - Multiple Inheritance: Multiple base classes
  - Multilevel Inheritance: Chain of inheritance
  - Hierarchical Inheritance: Multiple derived classes from one base

  Access Specifiers in Inheritance:
  - public inheritance: public → public, protected → protected
  - protected inheritance: public → protected, protected → protected
  - private inheritance: public → private, protected → private`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    estimatedTime: 55,
    order: 2,
    sectionId: 'oop',
    preTest: [
      {
        id: 'inherit-pre-1',
        question: 'What is inheritance in OOP?',
        options: ['Creating multiple objects', 'One class acquiring properties of another', 'Deleting objects', 'Copying objects'],
        correctAnswer: 1,
        explanation: 'Inheritance allows one class to acquire properties and methods of another class.'
      },
      {
        id: 'inherit-pre-2',
        question: 'What is the class that is inherited from called?',
        options: ['Child class', 'Derived class', 'Base class', 'Sub class'],
        correctAnswer: 2,
        explanation: 'The class that is inherited from is called the base class or parent class.'
      },
      {
        id: 'inherit-pre-3',
        question: 'What keyword is used to inherit from a class in C++?',
        options: ['extends', 'inherits', ':', 'from'],
        correctAnswer: 2,
        explanation: 'The colon (:) is used to inherit from a class in C++.'
      }
    ],
    postTest: [
      {
        id: 'inherit-post-1',
        question: 'What is the syntax for public inheritance?',
        options: ['class Derived extends Base', 'class Derived : public Base', 'class Derived inherits Base', 'class Derived from Base'],
        correctAnswer: 1,
        explanation: 'The syntax for public inheritance is "class Derived : public Base".'
      },
      {
        id: 'inherit-post-2',
        question: 'Can a derived class access private members of the base class?',
        options: ['Yes, always', 'No, never', 'Only with special keyword', 'Only in public inheritance'],
        correctAnswer: 1,
        explanation: 'Derived classes cannot directly access private members of the base class.'
      },
      {
        id: 'inherit-post-3',
        question: 'What is method overriding?',
        options: ['Creating new methods', 'Redefining base class methods in derived class', 'Deleting methods', 'Copying methods'],
        correctAnswer: 1,
        explanation: 'Method overriding is redefining a base class method in the derived class.'
      }
    ]
  },
  {
    id: 'polymorphism',
    title: 'Polymorphism',
    description: 'Understand polymorphism and virtual functions',
    content: `Polymorphism allows objects of different types to be treated as objects of a common base type, while still calling the appropriate methods for their actual type.

  Virtual Functions:
  \`\`\`cpp
  class Shape {
  public:
      virtual double area() = 0;  // Pure virtual function
      virtual void draw() {       // Virtual function
          cout << "Drawing a shape" << endl;
      }
  };

  class Circle : public Shape {
  private:
      double radius;

  public:
      Circle(double r) : radius(r) {}

      double area() override {
          return 3.14159 * radius * radius;
      }

      void draw() override {
          cout << "Drawing a circle" << endl;
      }
  };

  class Rectangle : public Shape {
  private:
      double width, height;

  public:
      Rectangle(double w, double h) : width(w), height(h) {}

      double area() override {
          return width * height;
      }

      void draw() override {
          cout << "Drawing a rectangle" << endl;
      }
  };
  \`\`\`

  Runtime Polymorphism:
  \`\`\`cpp
  Shape* shapes[] = {
      new Circle(5),
      new Rectangle(4, 6)
  };

  for (int i = 0; i < 2; i++) {
      shapes[i]->draw();  // Calls appropriate draw method
      cout << "Area: " << shapes[i]->area() << endl;
  }
  \`\`\``,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    estimatedTime: 50,
    order: 3,
    sectionId: 'oop',
    preTest: [
      {
        id: 'poly-pre-1',
        question: 'What is polymorphism?',
        options: ['Having multiple classes', 'One interface, multiple implementations', 'Creating objects', 'Deleting objects'],
        correctAnswer: 1,
        explanation: 'Polymorphism means "one interface, multiple implementations" - same interface behaving differently.'
      },
      {
        id: 'poly-pre-2',
        question: 'What keyword is used to make a function virtual in C++?',
        options: ['virtual', 'override', 'abstract', 'poly'],
        correctAnswer: 0,
        explanation: 'The virtual keyword is used to make a function virtual in C++.'
      },
      {
        id: 'poly-pre-3',
        question: 'What is a pure virtual function?',
        options: ['A function with no body', 'A function that must be overridden', 'A function with = 0', 'All of the above'],
        correctAnswer: 3,
        explanation: 'A pure virtual function has no body, must be overridden, and is declared with = 0.'
      }
    ],
    postTest: [
      {
        id: 'poly-post-1',
        question: 'What is the difference between virtual and pure virtual functions?',
        options: ['No difference', 'Virtual can have implementation, pure virtual cannot', 'Pure virtual can have implementation, virtual cannot', 'They are the same'],
        correctAnswer: 1,
        explanation: 'Virtual functions can have a default implementation, while pure virtual functions cannot and must be overridden.'
      },
      {
        id: 'poly-post-2',
        question: 'What is an abstract class?',
        options: ['A class with no methods', 'A class with at least one pure virtual function', 'A class with only virtual functions', 'A class with no constructor'],
        correctAnswer: 1,
        explanation: 'An abstract class is a class that has at least one pure virtual function and cannot be instantiated.'
      },
      {
        id: 'poly-post-3',
        question: 'When is the correct method called in polymorphism?',
        options: ['At compile time', 'At runtime', 'Never', 'At link time'],
        correctAnswer: 1,
        explanation: 'In runtime polymorphism, the correct method is determined and called at runtime based on the actual object type.'
      }
    ]
  }
];