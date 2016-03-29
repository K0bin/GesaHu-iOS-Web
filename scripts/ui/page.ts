module GesaHuVertretungsplan.Ui {
    export class Page {
        private _framework: Framework7;
        private _mainView: Framework7.View;
        private pageUrl: string;
        private pageName: string;
        private isDomCached: boolean;

        public constructor(framework: Framework7, mainView: Framework7.View, pageName: string, pageUrl: string, isDomCached: boolean) {
            if (!framework)
                throw new Error('Page needs an initialized framework');
            if (!mainView)
                throw new Error('Page needs an initialized view');
            if (!pageUrl || pageUrl.trim() == '')
                throw new Error('Page needs a url');

            this._framework = framework;
            this._mainView = mainView;
            this.pageUrl = pageUrl;
            this.pageName = pageName;
            this.isDomCached = isDomCached;
            this._framework.onPageBeforeInit(this.pageName, (page: Framework7.PageData) => { this.beforeInitialization(page); });
            this._framework.onPageInit(this.pageName, (page: Framework7.PageData) => { this.initialize(page); });
            this._framework.onPageReinit(this.pageName, (page: Framework7.PageData) => { this.reinitialize(page); });
        }

        public navigate(replace: boolean = false): void {
            var hasPages = this._mainView.activePage != undefined && this._mainView.activePage != null;

            if (!this.isDomCached)
                this._mainView.router.load({
                    url: this.pageUrl,
                    animatePages: !replace,
                    reload: replace && hasPages,
                });
            else
                this._mainView.router.load({
                    pageName: this.pageName,
                    animatePages: !replace,
                    reload: replace && hasPages,
                });
        }

        protected get framework(): Framework7 {
            return this._framework;
        }
        protected get mainView(): Framework7.View {
            return this._mainView;
        }

        protected beforeInitialization(page: Framework7.PageData): void {
        }

        protected initialize(page: Framework7.PageData): void {
        }

        protected reinitialize(page: Framework7.PageData): void {
        }
    }
}