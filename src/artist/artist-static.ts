import { Types } from 'mongoose';

export const artistsStatic = [
  {
    _id: Types.ObjectId(),
    fullName: 'Leonardo Da Vinci',
    description: 'Not only did Leonardo da Vinci experiment with mediums, but he also innovated different ways of creating striking compositions. In fact, his signature triangular composition is still used today and is widely considered one of the most visually pleasing painting layouts. He was also an early advocate of studying anatomical models to perfect his art, something that was illegal at the time.',
    yearsOfLife: '14/15 April 1452 – 2 May 1519',
    mainPaintings: [{}],
  },
];
