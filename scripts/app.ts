module GesaHuVertretungsplan {
    import MainPage = GesaHuVertretungsplan.Ui.MainPage;
    import AboutPage = GesaHuVertretungsplan.Ui.AboutPage;
    import PreferencesPage = GesaHuVertretungsplan.Ui.PreferencesPage;

    export class Application {
        private framework: Framework7;
        private mainView: Framework7.View;
        private mainPage: MainPage;
        private aboutPage: AboutPage;
        private preferencesPage: PreferencesPage;

        public constructor() {
            this.framework = new Framework7({
                sortable: false,
                modalTitle: 'GesaHu VP'
            });

            this.mainView = this.framework.addView('.view-main', {
                // Because we use fixed-through navbar we can enable dynamic navbar
                dynamicNavbar: true,
                domCache: true
            });

            this.checkPlatform();

            this.preferencesPage = new PreferencesPage(this.framework, this.mainView);
            this.mainPage = new MainPage(this.framework, this.mainView);
            this.aboutPage = new AboutPage(this.framework, this.mainView);
            this.mainPage.navigate(true);
        }

        private checkPlatform(): void {
            if (this.framework.device.android) {
                console.log('Android!');

                var link: string = 'https://play.google.com/store/apps/details?id=rhedox.gesahuvertretungsplan';
                this.framework.confirm('Installiere die Gesahu VP Android App!', 'Diese Web-App ist für iOS optimiert.', () => {
                    var win = window.open(link);
                    win.focus()
                }, () => { });
            } else if (this.framework.device.ios && !this.framework.device.webView) {
                console.log('Not standalone!');

                this.framework.popover('.popoverStandalone', "#popoverPosition");
            }
        }
    }
}

//Start the app
import Application = GesaHuVertretungsplan.Application;

window.onload = () => {
    var app = new Application();
};
