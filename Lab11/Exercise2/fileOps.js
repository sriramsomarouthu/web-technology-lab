// Import File System module
const fs = require('fs');

const fileName = 'sample.txt';

console.log('Starting file operations...\n');

// 1. Create & Write file
fs.writeFile(fileName, 'Initial content\n', (err) => {
    if (err) {
        console.error('Error creating file:', err);
        return;
    }
    console.log('✔ File created successfully');

    // 2. Read file
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        console.log('✔ File read successfully');
        console.log('Content after write:\n', data);

        // 3. Append data
        fs.appendFile(fileName, 'Appended content\n', (err) => {
            if (err) {
                console.error('Error appending data:', err);
                return;
            }
            console.log('✔ Data appended successfully');

            // 4. Read again
            fs.readFile(fileName, 'utf8', (err, updatedData) => {
                if (err) {
                    console.error('Error reading updated file:', err);
                    return;
                }
                console.log('✔ File read after append');
                console.log('Updated content:\n', updatedData);

                // 5. Delete file
                fs.unlink(fileName, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        return;
                    }
                    console.log('✔ File deleted successfully');
                    console.log('\nAll file operations completed successfully ✅');
                });
            });
        });
    });
});