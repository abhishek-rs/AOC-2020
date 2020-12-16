const { getInput } = require('./utils');
const findInInput = (input, line) => input.findIndex((x) => x === line);

const day16B = async () => {
  let input = await getInput('16', '\n');

  // Parsing input
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

  // Filter out invalids
  const otherValidTickets = otherTickets.filter(
    (tick) => !getInvalids(tick, rules).length
  );

  // Determine possible positions for each field using the rules
  let possibleFieldPositions = Object.keys(rules).reduce(
    (acc, rule) => ({
      [rule]: yourTicket.map((_, i) => i),
      ...acc,
    }),
    {}
  );
  for (i = 0; i < otherValidTickets.length; i++) {
    let currentTick = otherValidTickets[i];
    currentTick.forEach((field, fieldIndex) => {
      Object.values(rules).forEach((rule, ruleIndex) => {
        if (
          !(
            (field >= rule[0][0] && field <= rule[0][1]) ||
            (field >= rule[1][0] && field <= rule[1][1])
          )
        ) {
          let arrayToModify =
            possibleFieldPositions[Object.keys(rules)[ruleIndex]];
          let id = arrayToModify.findIndex((x) => x == fieldIndex);
          id !== -1 && arrayToModify.splice(id, 1);
        }
      });
    });
  }

  // Determine confirmed positions of each field
  // by elimination of fields that only pass a single rule
  let done = false;
  let confirmedFieldPositions = {};
  while (!done) {
    let nextConfirmedId = Object.values(possibleFieldPositions).findIndex(
      (arr, index) => arr.length === 1
    );
    let itemToRemove = Object.values(possibleFieldPositions)[
      nextConfirmedId
    ][0];
    confirmedFieldPositions[
      Object.keys(possibleFieldPositions)[nextConfirmedId]
    ] = itemToRemove;
    Object.values(possibleFieldPositions).forEach((arr) => {
      let id = arr.findIndex((x) => x === itemToRemove);
      id !== -1 && arr.splice(id, 1);
    });
    if (!Object.values(possibleFieldPositions).filter((x) => x.length).length) {
      done = true;
    }
  }

  // Determine the fields that start with departure
  const departureFields = Object.values(
    confirmedFieldPositions
  ).filter((val, index) =>
    /departure/i.test(Object.keys(confirmedFieldPositions)[index])
  );

  // Multiply those fields from your ticket
  return yourTicket.reduce(
    (acc, val, index) => (departureFields.includes(index) ? acc * val : acc),
    1
  );
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

module.exports = day16B;
