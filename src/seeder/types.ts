interface IPictureSeeder {
  name: string;
  image: string;
  yearOfCreation: string;
}

export interface IArtistSeeder {
  name: string;
  avatar: string;
  genres: string[];
  country: string;
  yearsOfLife: string;
  pictures: IPictureSeeder[];
}
