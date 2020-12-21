const { getInput } = require('./utils');
const { intersection } = require('ramda');

const day21A = async () => {
  const input = await getInput('21', '\n');
  const [foodIngredients, foodAllergens] = input.reduce(
    (acc, i) => {
      let regexMatch = i.match(/\([a-z ,]+\)/i);
      if (!regexMatch) return acc;
      let [ingredients, allergens] = [
        i.slice(0, regexMatch.index),
        regexMatch[0],
      ];
      ingredients = ingredients.split(' ').filter(Boolean);
      allergens = allergens.slice(10, -1).split(', ').filter(Boolean);
      return [
        [...acc[0], ingredients],
        [...acc[1], allergens],
      ];
    },
    [[], []]
  );
  const allergenPossibilities = foodAllergens.reduce(
    (acc, allergens, index) => {
      let retVal = Object.assign({}, acc);
      allergens.forEach((a) => {
        let existingPossibilities = acc[a];
        let newPossibilities = foodIngredients[index];
        if (existingPossibilities) {
          retVal = Object.assign(retVal, {
            [a]: intersection(existingPossibilities, newPossibilities),
          });
        } else {
          retVal[a] = newPossibilities;
        }
      });
      return retVal;
    },
    {}
  );

  let confirmedAllergicIngredients = [];
  while (
    confirmedAllergicIngredients.length <
    Object.keys(allergenPossibilities).length
  ) {
    const nextConfirmedAllergenId = Object.values(
      allergenPossibilities
    ).findIndex(
      (possibilities) =>
        possibilities.length === 1 &&
        !confirmedAllergicIngredients.includes(possibilities[0])
    );
    const nextConfirmedAllergen = Object.values(allergenPossibilities)[
      nextConfirmedAllergenId
    ][0];

    confirmedAllergicIngredients.push(nextConfirmedAllergen);
    Object.values(allergenPossibilities).forEach((val, index) => {
      if (index === nextConfirmedAllergenId) return;
      let indexOfConfirmed = val.findIndex((x) => x === nextConfirmedAllergen);
      indexOfConfirmed !== -1 && val.splice(indexOfConfirmed, 1);
    });
  }

  confirmedAllergicIngredients.sort((a, b) => {
    let aIndex = Object.values(allergenPossibilities).findIndex(
      (possibilities) => possibilities[0] === a
    );
    let bIndex = Object.values(allergenPossibilities).findIndex(
      (possibilities) => possibilities[0] === b
    );

    return Object.keys(allergenPossibilities)[aIndex] <
      Object.keys(allergenPossibilities)[bIndex]
      ? -1
      : 1;
  });

  return confirmedAllergicIngredients.join(',');
};

module.exports = day21A;
