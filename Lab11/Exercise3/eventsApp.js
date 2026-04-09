// Import events module
const EventEmitter = require('events');

// Create an EventEmitter object
const eventEmitter = new EventEmitter();

console.log('Starting Event-Driven Program...\n');

// 1. Register event listener (Listener 1)
eventEmitter.on('greet', (name) => {
    console.log(`Listener 1: Hello ${name}!`);
});

// 2. Register another listener for same event
eventEmitter.on('greet', (name) => {
    console.log(`Listener 2: Welcome ${name}!`);
});

// 3. Register another event
eventEmitter.on('status', (status) => {
    console.log(`Status Event: ${status}`);
});

// 4. Trigger events using emit()
console.log('Triggering greet event...');
eventEmitter.emit('greet', 'sriram'); // passing data

console.log('\nTriggering status event...');
eventEmitter.emit('status', 'Server is running');

// 5. Demonstrate asynchronous behavior
setTimeout(() => {
    console.log('\nTriggering greet event asynchronously...');
    eventEmitter.emit('greet', 'Async User');
}, 2000);