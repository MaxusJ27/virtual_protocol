// generate random users 
const generateRandomUser = () => {
    const names = ['Alice', 'Ben', 'Cathy', 'David', 'Emma', 'Fiona', 'George', 'Hannah', 'Ian', 'Jasmine', 'Bob', 'Charlie', 'Diana', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kelly', 'Liam', 'Mia', 'Noah', 'Olivia', 'William', 'Sophia', 'James', 'Amelia', 'Oliver', 'Charlotte', 'Ethan', 'Ava', 'Alexander', 'Isabella', 'Michael', 'Mia', 'Elijah', 'Emily', 'Daniel', 'Abigail'];
    const genders = ['Male', 'Female'];
    const locations = ['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Seattle', 'Boston', 'Miami', 'Denver', 'Austin', 'Portland'];
    const universities = ['NYU', 'UCLA', 'UChicago', 'Stanford', 'UW', 'Harvard', 'UM', 'CU Boulder', 'UT Austin', 'OSU', 'MIT', 'Caltech', 'Princeton', 'Yale', 'Columbia', 'UPenn', 'Brown', 'Duke', 'Cornell', 'UC Berkeley', 'Johns Hopkins', 'Northwestern', 'Rice', 'Georgetown', 'Emory'];
    const interests = ['Hiking', 'Photography', 'Traveling', 'Music', 'Art', 'Yoga', 'Coding', 'Gaming', 'Skiing', 'Reading', 'Dancing', 'Fashion', 'Camping', 'Cooking', 'Writing', 'Fishing', 'Paragliding', 'Rowing', 'Bouldering', 'Knitting', 'Surfing', 'Birdwatching', 'Painting', 'Gardening', 'Meditation', 'Sculpting', 'Archery', 'Running', 'Swimming', 'Woodworking', 'Cycling', 'Drawing', 'Skydiving', 'Singing', 'Rock Climbing', 'Cooking', 'Kayaking', 'Bowling', 'Golfing'];

    return {
        name: names[Math.floor(Math.random() * names.length)],
        gender: genders[Math.floor(Math.random() * genders.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        university: universities[Math.floor(Math.random() * universities.length)],
        interests: [interests[Math.floor(Math.random() * interests.length)], interests[Math.floor(Math.random() * interests.length)]],
        status: 'unmatched',
    };
};

const userData = []
// Generate 10 random users
for (let i = 0; i < 50; i++) {
    const newUser = generateRandomUser();
    userData.push(newUser);
}

module.exports = {
    users: userData,
}