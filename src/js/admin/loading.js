{
    let view = {
        el: '#siteLoading',
        show() {
            $(this.el).addClass('active');
        },
        hide() {
            $(this.el).removeClass('active');
        }
    };
    let model = {};
    let controller = {
        view: null,
        model: null,
        init() {
            this.view = view;
            this.model = model;
            this.bindEventHubs();
        },
        bindEventHubs() {
            window.eventHub.on('uploading', ()=> {
                this.view.show();
            });
            window.eventHub.on('after-upload', ()=> {
                this.view.hide();
            });
        }
    };

    controller.init(view, model);
}