module GesaHuVertretungsplan.Model {
    export class SchoolWeek {
        constructor() {
            throw new Error("Cannot instantiate this class.");
        }

        public static nextSchoolDay(date?: Date): Date {
            if (!date) {
                date = new Date();

                if (date.getHours() > 17 && date.getMinutes() > 15)
                    date.setDate(date.getDate() + 1);
            }

            if (date.getDay() == 0)
                date.setDate(date.getDate() + 1);
            else if (date.getDay() == 6)
                date.setDate(date.getDate() + 2);

            return date;
        }

        public static dateToString(date: Date): string {
            var days = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];

            var output = "";
            output += days[date.getDay()];
            output += ", ";
            output += SchoolWeek.toZeroNumber(date.getDate());
            output += ".";
            output += SchoolWeek.toZeroNumber(date.getMonth() + 1);
            output += ".";
            output += SchoolWeek.toZeroNumber(date.getFullYear());

            return output;
        }

        public static dateToPickerString(date: Date): string {
            var dateStr = "";
            dateStr += date.getFullYear().toString();
            dateStr += "-";
            dateStr += SchoolWeek.toZeroNumber(date.getMonth() + 1);
            dateStr += "-";
            dateStr += SchoolWeek.toZeroNumber(date.getDate());
            console.log(dateStr);
            return dateStr;
        }

        private static toZeroNumber(value: number): string {
            var output = "";
            if (value < 10) {
                output += "0";
            }
            output += value.toString();
            return output;
        }
    }
}