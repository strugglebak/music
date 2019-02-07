{
    let view = {
        el: '.form',
        template: `
            <div class="column">
                <div class="row">
                    <label>音乐标题:</label>
                    <input type="text">
                </div>
                <div class="row">
                    <label>歌手:</label>
                    <input type="text">
                </div>
                <div class="row">
                    <label>歌曲外链:</label>
                    <input type="text">
                </div>
                <div class="row">
                    <label>歌曲封面:</label>
                    <input type="text">
                </div>
                <div class="row actions">
                    <button type="submit">保 存</button>
                </div>
            </div>
            <div class="column">
                <div class="row">
                    <label>歌词:</label>
                    <textarea name="lyrics" cols="25" rows="10"></textarea>
                </div>
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