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
  const allPossibleIngredientsWithAllergens = Object.values(
    allergenPossibilities
  ).reduce((acc, ap) => [...acc, ...ap], []);

  return foodIngredients.reduce(
    (acc, fi) =>
      fi.reduce(
        (acc2, i) =>
          !allPossibleIngredientsWithAllergens.includes(i) ? acc2 + 1 : acc2,
        acc
      ),
    0
  );
};

module.exports = day21A;
