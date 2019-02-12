{
    let view = {
        el: 'nav.gloable-tabs > ol',
        init() {
            this.$el = $(this.el);
        },
    };
    let model = {};
    let controller = {
        view: null,
        model: null,
        init() {
            this.view = view;
            this.view.init();
            this.model = model;
            this.activeFirstPage();
            this.bindEvents();
        },
        bindEvents() {
            this.view.$el.on('click', 'li', (e)=> {
                let $el = $(e.currentTarget);
                $el.addClass('active')
                    .siblings().removeClass('active');
                if ($el.hasClass('page-recommands')) {
                    $('ol.tab-content > li.page-recommands').addClass('active').siblings().removeClass('active');
                } else if ($el.hasClass('page-hotsongs')) {
                    $('ol.tab-content > li.page-hotsongs').addClass('active').siblings().removeClass('active');
                } else if ($el.hasClass('page-search')) {
                    $('ol.tab-content > li.page-search').addClass('active').siblings().removeClass('active');
                }
            });
        },
        activeFirstPage() {
            $(this.view.$el.children()[0]).addClass('active');
        }
    };

    controller.init(view, model);
}