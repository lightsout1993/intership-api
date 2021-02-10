export interface FileDto {
  size: number;
  buffer: Buffer;
  encoding: string;
  mimetype: string;
  fieldname: string;
  originalfilename: string;
}
