import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SelectedYearService {
  private selectedYear: number | null = null;
  private selectedArea: string | null = null;

  setYear(year: number) {
    this.selectedYear = year;
  }

  setArea(area: string) {
    this.selectedArea = area;
  }
  getYear(): number | null {
    return this.selectedYear;
  }
  getArea(): string | null {
    return this.selectedArea;
  }
}
