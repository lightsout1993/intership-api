interface Block {
  id: number;
  form: number[][];
}

interface BlockInfo {
  index: number;
  isRotated: boolean;
}

interface LayoutResult {
  blockId: number;
  position: number;
  isRotated: boolean;
}

const getFirstAndLastRows = (block: Block) => [
  block.form[0],
  block.form[block.form.length - 1],
];

const isFilledRow = (row: number[]) => row.every(Boolean);

const findSuitableBlockForBegin = (blocks: Block[]) =>
  blocks.reduce(
    (acc, block, index) => {
      const firstAndLast = getFirstAndLastRows(block);
      const foundIndex = firstAndLast.findIndex(isFilledRow);

      if (!~foundIndex) return acc;

      return {
        index,
        isRotated: foundIndex !== 0,
      };
    },
    { index: -1, isRotated: false },
  );

const findIndexRowWithZero = (arr: number[][]): number =>
  arr.findIndex(isFilledRow);
const findLastIndexRowWithZero = (arr: number[][]): number =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  arr.findLastIndex(isFilledRow);

const compareTwoArrays = (arr1: number[], arr2: number[]) =>
  arr1.join() === arr2.join();
const reverseArray = (arr: number[]) => arr.slice().reverse();

const findSuitableNextBlock = (
  blocks: Block[],
  { form }: Block,
  info: BlockInfo,
) => {
  const findMethod = info.isRotated
    ? findLastIndexRowWithZero
    : findIndexRowWithZero;
  const extremeRowWithZero = findMethod(form);
  console.log(extremeRowWithZero);

  const offsetIndex = info.isRotated
    ? form.length - 1 - extremeRowWithZero
    : extremeRowWithZero;

  const findIndexSuitableBlock = (i: number, revert?: boolean) =>
    blocks.findIndex((block, index) => {
      console.log('findIndexSuitableBlock', i, revert);
      if (index === info.index) return false;

      const startIndex = offsetIndex - i;
      const endIndex = block.form.length - 1 - offsetIndex + i;

      let rowNextBlock = block.form[revert ? endIndex : startIndex];
      rowNextBlock = revert ? reverseArray(rowNextBlock) : rowNextBlock;

      if (info.isRotated) {
        const rowCurrentBlock = reverseArray(form[extremeRowWithZero + i]);

        return compareTwoArrays(rowCurrentBlock, rowNextBlock);
      }

      const rowCurrentBlock = form[extremeRowWithZero - i];

      return compareTwoArrays(rowCurrentBlock, rowNextBlock);
    });

  let foundIndex;
  let isRotated = false;

  for (let i = 0; i <= offsetIndex; i++) {
    foundIndex = findIndexSuitableBlock(i);
    if (foundIndex) break;
  }

  if (!foundIndex) {
    for (let i = 0; i <= offsetIndex; i++) {
      foundIndex = findIndexSuitableBlock(i, true);
      if (foundIndex) {
        isRotated = true;
        break;
      }
    }
  }

  return { index: foundIndex, isRotated };
};

function layout(blocks: Block[]) /*: LayoutResult[] */ {
  const indexs = [findSuitableBlockForBegin(blocks)];

  const next = findSuitableNextBlock(
    blocks,
    blocks[indexs[0].index],
    indexs[0],
  );

  console.log(indexs, next);
  // for (let i = 0; i < blocks.length; )
}

const blocks = [
  {
    id: 738,
    form: [
      [1, 0],
      [1, 1],
    ],
  },
  {
    id: 841,
    form: [
      [1, 1],
      [0, 1],
    ],
  },
];

layout(blocks);
