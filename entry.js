const prompts = require('prompts');
const day1A = require('./Day1A');
const day1B = require('./Day1B');
const day2A = require('./Day2A');
const day2B = require('./Day2B');

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
    ],
  });

  const answer = await selection.day();
  console.log('THE ANSWER IS:', answer);
})();
