module GesaHuVertretungsplan.Loader {
    import Student = GesaHuVertretungsplan.Model.Student;

    export class Preferences {
        private framework: Framework7;
        private cachedData: Object;

        public constructor(framework: Framework7) {
            if (!framework)
                throw new Error("framework");

            this.framework = framework;
        }

        public load(): void {
            this.cachedData = this.framework.formGetData("preferencesForm");            
        }

        public loadStudent(): Student {
            if (!this.cachedData)
                this.load();
            
            if (!this.cachedData || !this.cachedData['schoolyear'] || !this.cachedData['schoolclass'])
                return new Student("05", "a");
            else {
                let student = new Student(this.cachedData['schoolyear'], this.cachedData['schoolclass']);

                return student;
            }
        }

        public loadFilterRelevant(): boolean {
            if (!this.cachedData)
                this.load();

            if (!this.cachedData || !this.cachedData['filterrelevant'])
                return false;
            else
                return this.cachedData['filterrelevant'].length > 0 && this.cachedData['filterrelevant'][0] == 'on';
        }

        public loadRelevantOnTop(): boolean {
            if (!this.cachedData)
                this.load();

            if (!this.cachedData || !this.cachedData['relevanttop'])
                return false;
            else
                return this.cachedData['relevanttop'].length > 0 && this.cachedData['relevanttop'][0] == 'on';
        }
    }
}