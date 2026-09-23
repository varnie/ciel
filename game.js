import { extraVocabulary } from './themes.js';
export const vocabulary = {
  ...extraVocabulary,
  basics: [['le soleil','the sun'],['la lune','the moon'],['le ciel','the sky'],['une étoile','a star'],['un nuage','a cloud'],['la pluie','the rain'],['le vent','the wind'],['la neige','the snow'],['le jour','the day'],['la nuit','the night'],['un chat','a cat'],['un chien','a dog'],['un oiseau','a bird'],['un arbre','a tree'],['une fleur','a flower'],['la mer','the sea'],['la montagne','the mountain'],['la forêt','the forest'],['un livre','a book'],['une clé','a key']],
  food: [['le pain','bread'],['le lait','milk'],['le fromage','cheese'],['le beurre','butter'],['un œuf','an egg'],['une pomme','an apple'],['une fraise','a strawberry'],['une orange','an orange'],['le café','coffee'],['le thé','tea'],['le sucre','sugar'],['le sel','salt'],['une tasse','a cup'],['une assiette','a plate'],['une cuillère','a spoon'],['une fourchette','a fork'],['un couteau','a knife'],['une serviette','a napkin'],['le menu','the menu'],['l’addition','the bill']],
  city: [['la gare','the train station'],['la rue','the street'],['le pont','the bridge'],['le parc','the park'],['le musée','the museum'],['la banque','the bank'],['la pharmacie','the pharmacy'],['la boulangerie','the bakery'],['une école','a school'],['un hôpital','a hospital'],['un magasin','a shop'],['une maison','a house'],['un jardin','a garden'],['une voiture','a car'],['un vélo','a bicycle'],['un train','a train'],['un bus','a bus'],['un billet','a ticket'],['la porte','the door'],['la fenêtre','the window']]
};
export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}
export function makeRound(theme, mistakes = {}, random = Math.random) {
  return vocabulary[theme].map(([fr,en],index) => ({id:`${theme}-${index}`,fr,en}))
    .map(word => ({word, priority: random() + Math.min(Number(mistakes[word.id]) || 0, 4) * .12}))
    .sort((a,b) => b.priority - a.priority).slice(0,10).map(entry => entry.word);
}
export function isPair(a,b) {return Boolean(a && b && a.id === b.id && a.lang !== b.lang);}
