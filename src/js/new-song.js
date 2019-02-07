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
        }
    };
    let model = {};
    let controller = {
        view: null,
        model: null,
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
        }
    };

    controller.init(view, model);
}