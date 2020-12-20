const { getInput } = require('./utils');
const ruleExpansionCache = new Map();

const day19A = async () => {
  const input = await getInput('19', '\n');
  const pageBreak = input.findIndex((i) => !i.length);

  // Parsing input
  let rules = input.slice(0, pageBreak);
  rules = rules.reduce((acc, rule) => {
    let [ruleNo, ruleCond] = rule.split(': ');
    ruleNo = Number(ruleNo);
    if (ruleCond.includes('"a"') || ruleCond.includes('"b"')) {
      return acc.set(ruleNo, ruleCond === '"a"' ? 'a' : 'b');
    } else {
      if (ruleCond.includes('|')) {
        return acc.set(
          ruleNo,
          ruleCond.split(' | ').map((i) => i.split(' ').map(Number))
        );
      } else {
        return acc.set(ruleNo, [ruleCond.split(' ').map(Number)]);
      }
    }
  }, new Map());
  const messages = input.slice(pageBreak + 1);

  return messages.filter((m) => {
    let [matched, lastIndex] = testRule(0, m, rules);
    // messages might match but not fully, so check if lastIndex was the last char in message
    return matched && m.length === lastIndex;
  }).length;
};

const testRule = (ruleNo, message, allRules) => {
  let inCache = ruleExpansionCache.get(ruleNo);
  let ruleConditions;
  if (inCache) {
    ruleConditions = inCache;
  } else {
    ruleConditions = expandRule(ruleNo, allRules);
    ruleExpansionCache.set(ruleNo, ruleConditions);
  }
  return matchCondition(ruleConditions, message, 0);
};

const matchCondition = (condition, message, startIndex) => {
  let matched = true;
  let currentMessageIndex = startIndex;

  if (typeof condition === 'string') {
    return [condition === message[startIndex], currentMessageIndex + 1];
  }

  const isConditionArray = Array.isArray(condition);

  if (isConditionArray) {
    let conditionIndex = 0;
    let nextMessageIndex = currentMessageIndex;
    let currentMatched;
    while (
      conditionIndex < condition.length &&
      nextMessageIndex < message.length
    ) {
      [currentMatched, nextMessageIndex] = matchCondition(
        condition[conditionIndex],
        message,
        nextMessageIndex
      );
      if (!currentMatched) {
        return [currentMatched, currentMessageIndex];
      }
      matched = currentMatched;
      conditionIndex++;
    }
    currentMessageIndex = nextMessageIndex;
  } else {
    // it's an object with two options
    let options = Object.values(condition);
    let [leftOptionMatched, leftNextIndex] = matchCondition(
      options[0],
      message,
      currentMessageIndex
    );
    let [rightOptionMatched, rightNextIndex] = matchCondition(
      options[1],
      message,
      currentMessageIndex
    );

    if (leftOptionMatched) {
      return [leftOptionMatched, leftNextIndex];
    } else {
      return rightOptionMatched
        ? [rightOptionMatched, rightNextIndex]
        : [rightOptionMatched, currentMessageIndex];
    }
  }

  return [matched, currentMessageIndex];
};

const expandRule = (ruleNo, allRules) => {
  // creates an array of all possible combinations a rule can be expanded
  const ruleCond = allRules.get(ruleNo);
  if (typeof ruleCond === 'string') {
    return [ruleCond];
  }
  if (ruleCond.length > 1) {
    // branches are signified using objects with two items in them
    return [
      {
        0: ruleCond[0].reduce(
          (acc, rule) => [...acc, ...expandRule(rule, allRules)],
          []
        ),
        1: ruleCond[1].reduce(
          (acc, rule) => [...acc, ...expandRule(rule, allRules)],
          []
        ),
      },
    ];
  }
  if (ruleCond.length === 1) {
    return ruleCond[0].reduce(
      (acc, rule) => [...acc, ...expandRule(rule, allRules)],
      []
    );
  }
  return [];
};

module.exports = day19A;
