module.exports = {
    removeDisallowedStrings(obj, disallowed) {
    if (Array.isArray(obj)) {
        // Iterate over the array and remove disallowed strings
        for (let i = obj.length - 1; i >= 0; i--) {
            if (typeof obj[i] === 'string' && disallowed.includes(obj[i])) {
                // Remove the disallowed string
                obj.splice(i, 1);
            } else if (typeof obj[i] === 'object') {
                // Recursive call for objects within the array
                this.removeDisallowedStrings(obj[i], disallowed);
            }
        }
    } else if (typeof obj === 'object' && obj !== null) {
        // Iterate over object properties
        for (const key in obj) {
            if (disallowed.includes(key)) {
                // Delete the property if its value is disallowed
                delete obj[key];
            } else {
                // Recursive call for nested objects
                this.removeDisallowedStrings(obj[key], disallowed);
            }
        }
    }
}
}

// Example usage:
// const jsonObject = {
//     name: "Alice",
//     age: 30,
//     hobbies: ["knitting", "badminton", "traveling"],
//     details: {
//         favoriteColor: "blue",
//         dislikes: ["spam", "cold weather"]
//     }
// };
//
// const disallowedStrings = ["spam", "badminton"];
//
// removeDisallowedStrings(jsonObject, disallowedStrings);
// console.log(JSON.stringify(jsonObject, null, 2));
