{
    let view = {
        el: 'section.songs-play-list .loading-wrapper',
        init() {
            this.$el = $(this.el);
        }
    };
    let model = {};
    let controller = {
        view: null,
        model: null,
        init(view, model) {
            this.view = view;
            this.view.init();
            this.model = model;
            this.bindEvents();
            this.bindEventHubs();
        },
        bindEvents() {},
        bindEventHubs() {
            window.eventHub.on('loading', ()=> {
                this.addActiveClass();
            });
            window.eventHub.on('after-load', ()=> {
                this.removeActiveClass();
            });
        },
        addActiveClass() {
            this.view.$el.addClass('active');
        },
        removeActiveClass() {
            this.view.$el.removeClass('active');
        }
    }

    controller.init(view, model);
}