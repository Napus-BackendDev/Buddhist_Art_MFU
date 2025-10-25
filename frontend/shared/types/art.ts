import type { Localization } from "../common/localization";

export interface Arts {
  _id: string;
  type: string;
  user: {
    username: Localization;
  };
  picture: string;
  artId: string;
  artname: string;
  size: string;
  technique: string;
  concept: string;
  status: string;
  price: number;
  presentation: string;
  artAddress: string;
  ratio: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtDetail {
  _id: string;
  picture: string;
  artId: string;
  artname: string;
  user: {
    username: Localization;
  };
  size: string;
  technique: string;
  price: number;
  concept: string;
  type: string;
  presentation: string;
  status: string;
  artAddress: string;
  ratio: string;
  createdAt: string;
  updatedAt: string;
}
