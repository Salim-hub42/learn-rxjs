export type Category = 'Angular' | 'RxJS' | 'Pont' | 'Tests';

export interface HomeWidget {
  number: number;
  title: string;
  label: Category;
}
