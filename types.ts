export interface PolaroidData {
  imageSrc: string;
  caption: string;
  date: string;
}

export enum AppState {
  IDLE = 'IDLE',
  CAMERA = 'CAMERA',
  PREVIEW = 'PREVIEW',
}
