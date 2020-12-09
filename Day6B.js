const { Subject } = require('rxjs');
const { buffer, filter, map, mergeMap, toArray } = require('rxjs/operators');
const { sum, intersection } = require('ramda');
const { getInputObservable } = require('./utils');

const day6B = async () => {
  let answer;
  const inputObservable = await getInputObservable('6');
  const input$ = new Subject();
  const lineBreaks$ = input$.pipe(filter((x) => x === '\n'));
  const answers$ = input$.pipe(
    filter((x) => x !== '\n'),
    buffer(lineBreaks$)
  );
  const groupbreaks$ = answers$.pipe(filter((x) => !x.length));
  const commonAnswers$ = answers$.pipe(
    buffer(groupbreaks$),
    map((x) => x.filter((i) => i.length)),
    filter((i) => i.length),
    map((x) => x.reduce((acc, answer) => intersection(acc, answer), x[0])),
    map((x) => x.length),
    toArray()
  );
  const subscription = commonAnswers$.subscribe((x) => {
    answer = sum(x);
  });
  const subscription2 = inputObservable.subscribe(input$);
  subscription.add(subscription2);
  subscription.unsubscribe();
  return answer;
};

module.exports = day6B;
