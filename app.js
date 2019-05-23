'use strict';

const fs = require('fs');
const readline = require('readline');
//fs は、FileSystem（ファイルシステム）の略で、ファイルを扱うためのモジュール。
//readline は、ファイルを一行ずつ読み込むためのモジュール

const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
//popu-pref.csv ファイルから、ファイルを読み込みを行う Stream（ストリーム）を生成し、
//さらにそれを readline オブジェクトの input として設定し、 rl オブジェクトを作成している。

const prefectureDataMap = new Map();
// key: 都道府県 value: 集計データのオブジェクト prefectureとは”県”のこと。
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});

rl.on('close', () => {
  for (let [key, value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  console.log(rankingArray);
});
