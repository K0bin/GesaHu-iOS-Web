module GesaHuVertretungsplan.Model {
    export class Student {
        private _schoolYear: string;
        private _schoolClass: string;

        public constructor(schoolYear: string, schoolClass: string) {
            this._schoolYear = schoolYear;
            this._schoolClass = schoolClass;
        }

        public get schoolYear(): string {
            return this._schoolYear;
        }
        public get schoolClass(): string {
            return this._schoolClass;
        }
    }
}