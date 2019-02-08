{
    let view = {
        el: '.content > main .form-area',
        template: `
            <span class="new-song">新增歌曲</span>
            <span class="upload">上传成功! 请编辑歌曲信息</span>
            <span class="selected">编辑歌曲</span>
            <form class="form">
                <div class="column">
                    <div class="row">
                        <label>音乐标题:</label>
                        <input name="title" type="text" value="__title__">
                    </div>
                    <div class="row">
                        <label>歌手:</label>
                        <input name="author" type="text" value="__author__">
                    </div>
                    <div class="row">
                        <label>歌曲外链:</label>
                        <input name="link" type="text" value="__link__">
                    </div>
                    <div class="row">
                        <label>歌曲封面:</label>
                        <input name="cover" type="text" value="">
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
            </form>
        `,
        render(data) {
            let placeHolders = 'title author link id'.split(' ');
            let html = this.template;
            placeHolders.map((string)=> {
                html = html.replace(`__${string}__`, data[string] || '');
            });
            $(this.el).html(html);
        },
        clean() {
            this.render({});
        },
        clearInactive() {
            $(this.el).removeClass('inactive');
        },
        init() {
            this.$el = $(this.el);
            this.$el.addClass('inactive');
        },
    };
    let model = {
        data: {
            title: '', author: '', link: '', id: '',
        },
        save(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('title', data.title);
            song.set('author', data.author);
            song.set('link', data.link);
            return song.save().then((songData)=> {
                let {id, attributes} = songData;
                Object.assign(this.data, {id, ...attributes});
            }, (error)=> {
                console.log(error);
            });
        },
    };
    let controller = {
        view: null,
        model: null,
        init(view, model) {
            this.view = view;
            this.view.init();
            this.model = model;
            this.view.render(this.model.data);
            this.bindEvents();

            window.eventHub.on('upload', (data)=> {
                this.view.clearInactive();
                this.model.data = data;
                this.view.render(this.model.data);
                this.view.$el.find('.upload')
                    .removeClass('inactive')
                    .siblings().not('.form').addClass('inactive');
            });
            window.eventHub.on('selected', ()=> {
                this.view.clearInactive();
                this.view.$el.find('.selected')
                    .removeClass('inactive')
                    .siblings().not('.form').addClass('inactive');
            });
            window.eventHub.on('new-song', ()=> {
                this.view.clearInactive();
                this.view.$el.find('.new-song')
                    .removeClass('inactive')
                    .siblings().not('.form').addClass('inactive');
            });
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e)=> {
                e.preventDefault();
                let needs = 'title author link'.split(' ');
                let data = {};
                needs.map((string)=> {
                    data[string] = this.view.$el.find(`input[name=${string}]`).val();
                });
                this.model.save(data).then(
                    ()=> {
                        this.view.clean();
                        let dataCopy = JSON.parse(JSON.stringify(this.model.data));
                        window.eventHub.emit('save', dataCopy);
                        this.view.$el.addClass('inactive');
                    }, 
                    (error)=> {
                        console.log(error);
                    }
                );
            });
        },
    };

    controller.init(view, model);
}