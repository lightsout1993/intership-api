interface ImageDto {
  size: number;
  buffer: Buffer;
  encoding: string;
  mimetype: string;
  fieldname: string;
  originalname: string;
}

export default ImageDto;
