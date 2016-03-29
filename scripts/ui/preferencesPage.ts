module GesaHuVertretungsplan.Ui {

    export class PreferencesPage extends Page {
        private filterCheckbox: Dom7.Dom7;
        private relevantCheckbox: Dom7.Dom7;

        public constructor(framework: Framework7, mainView: Framework7.View) {
            super(framework, mainView, 'preferences', 'preferences.html', false);
        }

        protected initialize(page: Framework7.PageData): void {

            this.filterCheckbox = Dom7('#filterCheckbox');
            this.relevantCheckbox = Dom7('#relevantCheckboxContainer');
            this.updateCheckboxDependency(this.filterCheckbox.prop('checked'));
            this.filterCheckbox.change(() => {
                this.updateCheckboxDependency(this.filterCheckbox.prop('checked'));
            });
        }

        private updateCheckboxDependency(isFilterEnabled: boolean): void {
            if (isFilterEnabled)
                this.relevantCheckbox.addClass('disabled');
            else
                this.relevantCheckbox.removeClass('disabled');
        }
    }
}