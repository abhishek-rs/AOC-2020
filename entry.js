const prompts = require('prompts');
const day1A = require('./Day1A');
const day1B = require('./Day1B');
const day2A = require('./Day2A');
const day2B = require('./Day2B');
const day3A = require('./Day3A');
const day3B = require('./Day3B');

(async () => {
  const selection = await prompts({
    type: 'select',
    name: 'day',
    message: 'Which question are you looking for?',
    choices: [
      { title: 'Day 1 - A', value: day1A },
      { title: 'Day1 - B', value: day1B },
      { title: 'Day2 - A', value: day2A },
      { title: 'Day2 - B', value: day2B },
      { title: 'Day3 - A', value: day3A },
      { title: 'Day3 - B', value: day3B },
    ],
  });

  const answer = await selection.day();
  console.log('THE ANSWER IS:', answer);
})();
