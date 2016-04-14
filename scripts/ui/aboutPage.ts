module GesaHuVertretungsplan.Ui {

    export class AboutPage extends Page {
        public constructor(framework: Framework7, mainView: Framework7.View) {
            super(framework, mainView, 'about', 'about.html', false);
        }

        protected initialize(page: Framework7.PageData): void {
        }
    }
}