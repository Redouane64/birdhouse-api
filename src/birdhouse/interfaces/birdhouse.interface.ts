export interface Birdhouse {
  id: string;
  ubid: string;
  name: string;
  longitude: number;
  latitude: number;
  birds: number;
  eggs: number;
}

export type Occupancy = Pick<Birdhouse, 'birds' | 'eggs'>;
