export const defaultQuizzes = [
    {
        id: "node-js-fundamentals",
        title: "Node.js Fundamentals Quiz",
        category: "BACKEND DEVELOPMENT BOOTCAMP",
        shortCategory: "BACKEND",
        description: "Test your knowledge on core Node.js concepts including event loops, modules, file systems, and asynchronous programming.",
        difficulty: "INTERMEDIATE",
        difficultyColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
        questionsCount: 15,
        durationMinutes: 20,
        attemptsAllowed: 2,
        passingScore: 70,
        status: "available", // 'available' | 'in-progress' | 'completed'
        progress: null,
        score: null,
        questions: [
            {
                id: "q1",
                number: 1,
                question: "Which of the following modules is used in Node.js to work with file paths?",
                options: [
                    { id: "a", label: "fs" },
                    { id: "b", label: "path" },
                    { id: "c", label: "url" },
                    { id: "d", label: "os" },
                ],
                correctAnswer: "b",
                explanation: "The 'path' module provides utilities for working with file and directory paths."
            },
            {
                id: "q2",
                number: 2,
                question: "What is the primary purpose of the Event Loop in Node.js?",
                options: [
                    { id: "a", label: "To run multiple threads simultaneously" },
                    { id: "b", label: "To handle asynchronous operations using a single-threaded non-blocking architecture" },
                    { id: "c", label: "To compile JavaScript into machine code" },
                    { id: "d", label: "To manage database connection pooling" },
                ],
                correctAnswer: "b",
                explanation: "The Event Loop allows Node.js to perform non-blocking I/O operations by offloading operations to the system kernel whenever possible."
            },
            {
                id: "q3",
                number: 3,
                question: "Which method is used to read the contents of a file asynchronously in Node.js?",
                options: [
                    { id: "a", label: "fs.readSync()" },
                    { id: "b", label: "fs.readFileSync()" },
                    { id: "c", label: "fs.readFile()" },
                    { id: "d", label: "fs.openFile()" },
                ],
                correctAnswer: "c",
                explanation: "fs.readFile() reads the entire contents of a file asynchronously without blocking the event loop."
            },
            {
                id: "q4",
                number: 4,
                question: "Which HTTP method is commonly used to update an existing resource?",
                options: [
                    { id: "a", label: "GET" },
                    { id: "b", label: "POST" },
                    { id: "c", label: "PUT" },
                    { id: "d", label: "DELETE" },
                ],
                correctAnswer: "c",
                explanation: "PUT or PATCH is standard for updating an existing resource in RESTful API architecture."
            },
            {
                id: "q5",
                number: 5,
                question: "How do you import a CommonJS module in Node.js?",
                options: [
                    { id: "a", label: "import module from 'module'" },
                    { id: "b", label: "require('module')" },
                    { id: "c", label: "include('module')" },
                    { id: "d", label: "using('module')" },
                ],
                correctAnswer: "b",
                explanation: "require() is the built-in function in Node.js to include external CommonJS modules."
            },
            {
                id: "q6",
                number: 6,
                question: "What is `process.nextTick()` used for?",
                options: [
                    { id: "a", label: "To schedule a callback before the next event loop iteration begins" },
                    { id: "b", label: "To delay execution by 1000 milliseconds" },
                    { id: "c", label: "To clear the memory garbage collection" },
                    { id: "d", label: "To stop the current Node.js process" },
                ],
                correctAnswer: "a",
                explanation: "process.nextTick() adds the callback to the next tick queue which is processed before the event loop continues."
            },
            {
                id: "q7",
                number: 7,
                question: "Which package is commonly used as a web framework on top of Node.js?",
                options: [
                    { id: "a", label: "Django" },
                    { id: "b", label: "Express.js" },
                    { id: "c", label: "Flask" },
                    { id: "d", label: "Spring Boot" },
                ],
                correctAnswer: "b",
                explanation: "Express.js is the most popular fast, unopinionated, minimalist web framework for Node.js."
            },
            {
                id: "q8",
                number: 8,
                question: "What does the `npm` acronym stand for?",
                options: [
                    { id: "a", label: "Node Project Manager" },
                    { id: "b", label: "Node Package Manager" },
                    { id: "c", label: "New Package Module" },
                    { id: "d", label: "Network Protocol Manager" },
                ],
                correctAnswer: "b",
                explanation: "npm stands for Node Package Manager, the default package manager for Node.js."
            },
            {
                id: "q9",
                number: 9,
                question: "What is a Buffer in Node.js?",
                options: [
                    { id: "a", label: "A temporary storage for raw binary data allocated outside the V8 heap" },
                    { id: "b", label: "A string concatenation helper" },
                    { id: "c", label: "A database query optimizer" },
                    { id: "d", label: "A cache for HTTP headers" },
                ],
                correctAnswer: "a",
                explanation: "The Buffer class in Node.js handles raw binary data directly in memory."
            },
            {
                id: "q10",
                number: 10,
                question: "Which object emits events in Node.js?",
                options: [
                    { id: "a", label: "EventEmitter" },
                    { id: "b", label: "EventDispatcher" },
                    { id: "c", label: "EventNotifier" },
                    { id: "d", label: "EventPublisher" },
                ],
                correctAnswer: "a",
                explanation: "All objects that emit events in Node.js are instances of the EventEmitter class."
            },
            {
                id: "q11",
                number: 11,
                question: "What is the default scope of variables in a Node.js module?",
                options: [
                    { id: "a", label: "Global scope" },
                    { id: "b", label: "Module (local) scope" },
                    { id: "c", label: "Function scope" },
                    { id: "d", label: "Block scope across all files" },
                ],
                correctAnswer: "b",
                explanation: "Each Node.js module wraps code in a function wrapper, giving variables local module scope."
            },
            {
                id: "q12",
                number: 12,
                question: "Which environment variable is conventionally used to indicate production mode in Node.js?",
                options: [
                    { id: "a", label: "ENV_MODE=prod" },
                    { id: "b", label: "NODE_ENV=production" },
                    { id: "c", label: "APP_ENV=release" },
                    { id: "d", label: "STAGE=production" },
                ],
                correctAnswer: "b",
                explanation: "NODE_ENV is commonly set to 'production' to enable performance optimizations in frameworks."
            },
            {
                id: "q13",
                number: 13,
                question: "What does `Stream` in Node.js provide?",
                options: [
                    { id: "a", label: "A way to handle reading/writing data piece by piece continuously" },
                    { id: "b", label: "A visual video rendering engine" },
                    { id: "c", label: "A synchronous array sorting utility" },
                    { id: "d", label: "A method to compress HTML files" },
                ],
                correctAnswer: "a",
                explanation: "Streams are collections of data that might not be available all at once and don't have to fit in memory."
            },
            {
                id: "q14",
                number: 14,
                question: "Which method is used to listen to an event on an EventEmitter instance?",
                options: [
                    { id: "a", label: "emitter.listen(event, cb)" },
                    { id: "b", label: "emitter.on(event, cb)" },
                    { id: "c", label: "emitter.bind(event, cb)" },
                    { id: "d", label: "emitter.attach(event, cb)" },
                ],
                correctAnswer: "b",
                explanation: "emitter.on() (alias for emitter.addListener()) registers a listener callback for the event."
            },
            {
                id: "q15",
                number: 15,
                question: "What is middleware in Express.js?",
                options: [
                    { id: "a", label: "Functions that have access to the request object (req), response object (res), and next middleware" },
                    { id: "b", label: "Database ORM libraries" },
                    { id: "c", label: "A hardware bridge driver" },
                    { id: "d", label: "A CSS preprocessor plugin" },
                ],
                correctAnswer: "a",
                explanation: "Middleware functions can execute code, modify req/res objects, end request-response cycles, and call next()."
            },
        ],
    },
    {
        id: "react-components-props",
        title: "React Components & Props",
        category: "FRONTEND WEB DEVELOPMENT",
        shortCategory: "FRONTEND",
        description: "Modern Frontend with React. Covers functional components, props destructuring, JSX syntax, and component reusability.",
        difficulty: "BEGINNER",
        difficultyColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        questionsCount: 10,
        durationMinutes: 15,
        attemptsAllowed: 3,
        passingScore: 70,
        status: "completed",
        progress: {
            answeredCount: 10,
            totalCount: 10,
            scorePercentage: 92,
            passed: true,
            completedAt: "2024-08-20T10:30:00Z",
        },
        score: 92,
        questions: [
            {
                id: "rq1",
                number: 1,
                question: "What is JSX in React?",
                options: [
                    { id: "a", label: "A JavaScript syntax extension that looks like HTML" },
                    { id: "b", label: "A new CSS stylesheet standard" },
                    { id: "c", label: "A backend database language" },
                    { id: "d", label: "A JSON parser library" },
                ],
                correctAnswer: "a",
                explanation: "JSX is a syntax extension for JavaScript recommended for describing UI in React."
            },
            {
                id: "rq2",
                number: 2,
                question: "How are props passed to a React child component?",
                options: [
                    { id: "a", label: "Via HTML attributes on the component tag" },
                    { id: "b", label: "Via global window variables" },
                    { id: "c", label: "Through CSS class names" },
                    { id: "d", label: "Using the export default statement" },
                ],
                correctAnswer: "a",
                explanation: "Props are passed as custom attributes in JSX: <Child name='Alex' />."
            },
            {
                id: "rq3",
                number: 3,
                question: "Are React props mutable inside the receiving component?",
                options: [
                    { id: "a", label: "Yes, they can be modified directly" },
                    { id: "b", label: "No, props are read-only (immutable)" },
                    { id: "c", label: "Only in class components" },
                    { id: "d", label: "Only if declared with let" },
                ],
                correctAnswer: "b",
                explanation: "Props are read-only to guarantee pure component behavior and predictable renders."
            },
        ],
    },
    {
        id: "neural-networks-arch",
        title: "Neural Networks Arch",
        category: "DATA SCIENCE & AI SPECIALIZATION",
        shortCategory: "DATA SCIENCE",
        description: "Deep Learning Specialization. Advanced architectures including CNNs, RNNs, Transformers, and backpropagation mechanics.",
        difficulty: "ADVANCED",
        difficultyColor: "text-rose-400 border-rose-500/30 bg-rose-500/10",
        questionsCount: 20,
        durationMinutes: 30,
        attemptsAllowed: 2,
        passingScore: 75,
        status: "in-progress",
        progress: {
            answeredCount: 4,
            totalCount: 20,
            timeRemainingSeconds: 862, // 14:22 Left
            currentQuestion: 4,
        },
        score: null,
        questions: [
            {
                id: "nq1",
                number: 1,
                question: "Which activation function is most commonly used in hidden layers of modern deep neural networks to mitigate vanishing gradients?",
                options: [
                    { id: "a", label: "Sigmoid" },
                    { id: "b", label: "Tanh" },
                    { id: "c", label: "ReLU (Rectified Linear Unit)" },
                    { id: "d", label: "Softmax" },
                ],
                correctAnswer: "c",
                explanation: "ReLU outputs x for x > 0 and 0 otherwise, preventing gradient saturation for positive activations."
            },
            {
                id: "nq2",
                number: 2,
                question: "What is the purpose of Dropout in deep learning models?",
                options: [
                    { id: "a", label: "To speed up data download" },
                    { id: "b", label: "To prevent overfitting by randomly deactivating neurons during training" },
                    { id: "c", label: "To increase model parameter count" },
                    { id: "d", label: "To replace activation functions" },
                ],
                correctAnswer: "b",
                explanation: "Dropout is a regularization technique where randomly selected neurons are ignored during training."
            },
        ],
    },
    {
        id: "javascript-async-mastery",
        title: "Asynchronous JavaScript & Promises",
        category: "FRONTEND WEB DEVELOPMENT",
        shortCategory: "JAVASCRIPT",
        description: "Deep dive into Promises, async/await, Microtask queue, Event Loop, and handling concurrency.",
        difficulty: "INTERMEDIATE",
        difficultyColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
        questionsCount: 12,
        durationMinutes: 15,
        attemptsAllowed: 2,
        passingScore: 70,
        status: "available",
        progress: null,
        score: null,
        questions: [
            {
                id: "jq1",
                number: 1,
                question: "What does Promise.all() return if one of the promises rejects?",
                options: [
                    { id: "a", label: "It ignores the error and returns successful results" },
                    { id: "b", label: "It immediately rejects with the reason of the first rejected promise" },
                    { id: "c", label: "It pauses until all promises resolve" },
                    { id: "d", label: "It returns an array with null in place of the rejected item" },
                ],
                correctAnswer: "b",
                explanation: "Promise.all fails-fast: if any promise in the input array rejects, the whole returned promise rejects immediately."
            }
        ]
    }
];

export const defaultStats = {
    available: 12,
    inProgress: 2,
    completed: 45,
    averageScore: "88%",
};
