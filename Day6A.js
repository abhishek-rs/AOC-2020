const { Subject } = require('rxjs');
const {
  buffer,
  filter,
  map,
  mergeMap,
  toArray,
  tap,
} = require('rxjs/operators');
const { uniq, sum } = require('ramda');
const { getInputObservable } = require('./utils');

const day6A = async () => {
  let answer;
  const inputObservable = await getInputObservable('6');
  const input$ = new Subject();
  const lineBreaks$ = input$.pipe(filter((x) => x === '\n'));
  const answers$ = input$.pipe(
    filter((x) => x !== '\n'),
    buffer(lineBreaks$)
  );
  const groupbreaks$ = answers$.pipe(filter((x) => !x.length));
  const uniqueAnswers$ = answers$.pipe(
    buffer(groupbreaks$),
    map((x) => x.flat()),
    filter((i) => i.length),
    map((x) => uniq(x)),
    map((x) => x.length),
    toArray()
  );
  const subscription = uniqueAnswers$.subscribe((x) => {
    answer = sum(x);
  });
  const subscription2 = inputObservable.subscribe(input$);
  subscription.add(subscription2);
  subscription.unsubscribe();
  return answer;
};

module.exports = day6A;
