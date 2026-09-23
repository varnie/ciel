import test from 'node:test';
import assert from 'node:assert/strict';
import {vocabulary,makeRound,isPair,shuffle} from './game.js';
import {themeCatalog} from './themes.js';
import {timePalette} from './sky.js';
import {illustratedThemes,themeArt} from './theme-art.js';
test('50 themes have at least 10 unambiguous French-English pairs', () => {
  assert.equal(Object.keys(vocabulary).length,50);
  for (const words of Object.values(vocabulary)) {
    assert.ok(words.length >= 10);
    for (const side of [0,1]) assert.equal(new Set(words.map(word => word[side])).size,words.length);
  }
});
test('a round has ten distinct pairs from its theme', () => {
  for (const theme of Object.keys(vocabulary)) {
    const round = makeRound(theme);
    assert.equal(round.length,10); assert.equal(new Set(round.map(word => word.id)).size,10);
    assert.ok(round.every(word => word.id.startsWith(theme)));
  }
});
test('matching requires the same identity and opposite languages', () => {
  assert.equal(isPair({id:'a',lang:'fr'},{id:'a',lang:'en'}),true);
  assert.equal(isPair({id:'a',lang:'fr'},{id:'b',lang:'en'}),false);
  assert.equal(isPair({id:'a',lang:'fr'},{id:'a',lang:'fr'}),false);
  assert.equal(isPair(null,{id:'a',lang:'fr'}),false);
});
test('previously missed words get priority with equal random scores', () => {
  const round = makeRound('basics',{'basics-19':4}, () => .5);
  assert.equal(round[0].id,'basics-19');
});
test('shuffle preserves entries without mutating input', () => {
  const original = [1,2,3,4]; const result = shuffle(original, () => 0);
  assert.deepEqual(original,[1,2,3,4]); assert.deepEqual([...result].sort(),original); assert.notDeepEqual(result,original);
});
test('catalog and vocabulary stay aligned with stable distinct IDs', () => {
  assert.equal(new Set(themeCatalog.map(theme=>theme.id)).size,50);
  assert.deepEqual(themeCatalog.map(theme=>theme.id).sort(),Object.keys(vocabulary).sort());
  assert.equal(Object.values(vocabulary).flat().length,530);
});
test('local sky changes at dawn, day, dusk and night boundaries', () => {
  for (const [hour,expected] of [[0,'night'],[4,'night'],[5,'dawn'],[7,'dawn'],[8,'day'],[17,'day'],[18,'dusk'],[20,'dusk'],[21,'night'],[23,'night']]) assert.equal(timePalette(hour),expected);
});
test('every theme has a distinct vector illustration', () => {
  assert.deepEqual(illustratedThemes.sort(),Object.keys(vocabulary).sort());
  assert.equal(new Set(illustratedThemes.map(themeArt)).size,50);
  for (const id of illustratedThemes) assert.ok(!themeArt(id).includes('undefined'));
});
