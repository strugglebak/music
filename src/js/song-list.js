{
    let view = {
        el: '.songs-list-wrapper',
        template: `
            <ul class="songs-list">
                <li class="active">
                    <div class="song-header">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-song"></use>
                        </svg>
                    </div>
                    <div class="song-content">
                        <div class="song-name">
                            <span>我是不是你最疼爱的人</span>
                        </div>
                        <div class="song-author">
                            <div class="song-author-header">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-author"></use>
                                </svg>
                            </div>
                            <div class="song-author-content">
                                <span>李代沫</span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
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