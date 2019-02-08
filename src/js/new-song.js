{
    let view = {
        el: '#newSong',
        template: `
            <div class="new-song-header">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-add"></use>
                </svg>
            </div>
            <div class="new-song-content">
                <span>新增歌曲</span>
            </div>
        `,
        render(data) {
            $(this.el).html(this.template);
        },
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
            this.view.render(this.model.data);
            this.bindEvents();
        },
        bindEvents() {
            this.view.$el.on('click', (e)=> {
                window.eventHub.emit('new-song', {});
                console.log('我点击了 new song');
            });
        }
    };

    controller.init(view, model);
}