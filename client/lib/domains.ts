export interface DomainConfig {
    id: string;
    title: string;
    icon: string;
    iconBg: string;
    questions: string[];
}

export const DOMAINS: Record<string, DomainConfig> = {
    'javascript-node': {
        id: 'javascript-node',
        title: 'JavaScript/Node.js',
        icon: '🟨',
        iconBg: 'bg-yellow-400 text-black font-extrabold',
        questions: [
            "What is the difference between var, let, and const in JavaScript, and how do their scopes differ in a Node.js application?",
            "How would you approach implementing a mechanism to enforce immutable data structures in a Node.js application, considering the differences between 'let' and 'const', and what benefits or trade-offs do you think this approach would have in terms of code maintainability and performance?",
            "How would you design a scalable and fault-tolerant Node.js application that leverages clustering and load balancing to distribute incoming requests across multiple worker processes, while also ensuring seamless session management and data consistency across the cluster?"
        ]
    },
    'react': {
        id: 'react',
        title: 'React',
        icon: '⚛️',
        iconBg: 'bg-purple-100 text-purple-600',
        questions: [
            "Explain the concept of Virtual DOM in React and how Reconciliation works under the hood.",
            "How do useEffect and useLayoutEffect differ, and when should you choose one over the other?",
            "How would you optimize performance in a large React application with deep component trees and frequent state updates?"
        ]
    },
    'python': {
        id: 'python',
        title: 'Python',
        icon: '🐍',
        iconBg: 'bg-green-100 text-green-700',
        questions: [
            "What is GIL (Global Interpreter Lock) in Python and how does it impact multi-threaded performance?",
            "Explain the difference between deepcopy and shallow copy in Python with code examples.",
            "How do Python decorators work under the hood, and how would you build a custom rate-limiting decorator?"
        ]
    },
    'data-science': {
        id: 'data-science',
        title: 'Data Science',
        icon: '📊',
        iconBg: 'bg-blue-100 text-blue-600',
        questions: [
            "What is the Bias-Variance tradeoff in Machine Learning and how do you handle overfitting?",
            "Explain the difference between L1 (Lasso) and L2 (Ridge) regularization.",
            "How would you handle highly imbalanced datasets during model training?"
        ]
    },
    'devops': {
        id: 'devops',
        title: 'DevOps',
        icon: '⚙️',
        iconBg: 'bg-gray-100 text-gray-700',
        questions: [
            "What is the difference between Docker Containers and Virtual Machines?",
            "How do Kubernetes Pods, Deployments, and Services interact with each other?",
            "Explain Zero Downtime Deployment strategies like Blue-Green and Canary deployments."
        ]
    },
    'system-design': {
        id: 'system-design',
        title: 'System Design',
        icon: '🏗️',
        iconBg: 'bg-amber-100 text-amber-700',
        questions: [
            "How would you design a scalable URL shortener service like Bitly?",
            "Explain the CAP Theorem and how it influences database selection in distributed systems.",
            "How would you implement caching strategies (Write-Through vs Cache-Aside) for high traffic APIs?"
        ]
    },
    'database-design': {
        id: 'database-design',
        title: 'Database Design',
        icon: '🗄️',
        iconBg: 'bg-emerald-100 text-emerald-700',
        questions: [
            "What are the ACID properties in relational databases and how are they guaranteed?",
            "Explain database indexing (B-Trees vs Hash indexes) and when an index might degrade query performance.",
            "How do SQL and NoSQL databases handle schema evolution and horizontal scaling differently?"
        ]
    },
    'general': {
        id: 'general',
        title: 'General',
        icon: '🎯',
        iconBg: 'bg-orange-100 text-orange-600',
        questions: [
            "Tell me about a challenging technical problem you solved recently and your approach.",
            "How do you prioritize trade-offs between code quality, speed of delivery, and technical debt?",
            "Describe how you resolve technical disagreements within a software engineering team."
        ]
    }
};
