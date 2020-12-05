const prompts = require('prompts');
const day1A = require('./Day1A');
const day1B = require('./Day1B');
const day2A = require('./Day2A');
const day2B = require('./Day2B');
const day3A = require('./Day3A');
const day3B = require('./Day3B');
const day4A = require('./Day4A');
const day4B = require('./Day4B');
const day5A = require('./Day5A');
const day5B = require('./Day5B');

(async () => {
  const selection = await prompts({
    type: 'select',
    name: 'day',
    message: 'Which question are you looking for?',
    choices: [
      { title: 'Day 1 - A', value: day1A },
      { title: 'Day 1 - B', value: day1B },
      { title: 'Day 2 - A', value: day2A },
      { title: 'Day 2 - B', value: day2B },
      { title: 'Day 3 - A', value: day3A },
      { title: 'Day 3 - B', value: day3B },
      { title: 'Day 4 - A', value: day4A },
      { title: 'Day 4 - B', value: day4B },
      { title: 'Day 5 - A', value: day5A },
      { title: 'Day 5 - B', value: day5B },
    ],
  });

  const answer = await selection.day();
  console.log('The answer to that question is:', answer);
})();
