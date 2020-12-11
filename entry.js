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
const day6A = require('./Day6A');
const day6B = require('./Day6B');
const day7A = require('./Day7A');
const day7B = require('./Day7B');
const day8A = require('./Day8A');
const day8B = require('./Day8B');
const day9A = require('./Day9A');
const day9B = require('./Day9B');
const day10A = require('./Day10A');
const day10B = require('./Day10B');
const day11A = require('./Day11A');
const day11B = require('./Day11B');

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
      { title: 'Day 6 - A', value: day6A },
      { title: 'Day 6 - B', value: day6B },
      { title: 'Day 7 - A', value: day7A },
      { title: 'Day 7 - B', value: day7B },
      { title: 'Day 8 - A', value: day8A },
      { title: 'Day 8 - B', value: day8B },
      { title: 'Day 9 - A', value: day9A },
      { title: 'Day 9 - B', value: day9B },
      { title: 'Day 10 - A', value: day10A },
      { title: 'Day 10 - B', value: day10B },
      { title: 'Day 11 - A', value: day11A },
      { title: 'Day 11 - B', value: day11B },
    ],
  });

  const answer = await selection.day();
  console.log('The answer to that question is:', answer);
})();
