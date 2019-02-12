{
    let view = {
        el: 'section.songs-list',
        init() {
            this.$el = $(this.el);
        }
    };
    let model = {};
    let controller = {
        view: null,
        model: null,
        init() {
            this.view = view;
            this.view.init();
            this.model = model;
            this.bindEvents();
        },
        bindEvents() {},
    };

    controller.init(view, model);
}