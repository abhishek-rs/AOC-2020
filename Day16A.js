const { getInput } = require('./utils');

const findInInput = (input, line) => input.findIndex((x) => x === line);

const day16A = async () => {
  let input = await getInput('16', '\n');
  const yourTicketIndex = findInInput(input, 'your ticket:') + 1;
  const otherTicketIndex = findInInput(input, 'nearby tickets:') + 1;
  let rules = input.slice(0, yourTicketIndex - 2);
  rules = rules.reduce((acc, rule) => {
    let [ruleName, ruleLimits] = rule.split(': ');
    return {
      [ruleName]: ruleLimits.split(' or ').map((x) => x.split('-').map(Number)),
      ...acc,
    };
  }, {});
  const yourTicket = input[yourTicketIndex].split(',').map(Number);
  const otherTickets = input
    .slice(otherTicketIndex)
    .map((x) => x.split(',').map(Number));
  const inValidValues = otherTickets.reduce((acc, tick) => {
    const allInvalids = getInvalids(tick, rules);
    return [...allInvalids, ...acc];
  }, []);
  return inValidValues.reduce((acc, x) => acc + x, 0);
};

const getInvalids = (ticket, rules) =>
  ticket.filter(
    (field) =>
      !Object.values(rules)
        .reduce(
          (acc, rule) => [
            (field >= rule[0][0] && field <= rule[0][1]) ||
              (field >= rule[1][0] && field <= rule[1][1]),
            ...acc,
          ],
          []
        )
        .filter(Boolean).length
  );

module.exports = day16A;
