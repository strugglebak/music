{
    let view = {
        el: '.content > main .form-area',
        template: `
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
                        <input name="cover" type="text" value="__cover__">
                    </div>
                    <div class="row actions">
                        <button type="submit">保 存</button>
                    </div>
                </div>
                <div class="column">
                    <div class="row">
                        <label>歌词:</label>
                        <textarea name="lyric" cols="25" rows="10">__lyric__</textarea>
                    </div>
                </div>
            </form>
        `,
        render(data) {
            let placeHolders = 'title author link cover lyric id'.split(' ');
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
            title: '', author: '', link: '', cover: '', lyric: '', id: '',
        },
        save(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('title', data.title);
            song.set('author', data.author);
            song.set('link', data.link);
            song.set('lyric', data.lyric);
            song.set('cover', data.cover);
            return song.save().then((songData)=> {
                let {id, attributes} = songData;
                Object.assign(this.data, {id, ...attributes});
            }, (error)=> {
                console.log(error);
            });
        },
        update(data) {
            var song = AV.Object.createWithoutData('Song', this.data.id);
            song.set('title', data.title);
            song.set('author', data.author);
            song.set('link', data.link);
            song.set('lyric', data.lyric);
            song.set('cover', data.cover);
            return song.save().then((songData)=> {
                let {id, attributes} = songData;
                Object.assign(this.data, {id, ...attributes});
            }, (error)=> {console.log(error)});
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
                this.view.$el.find('span.upload')
                    .removeClass('inactive')
                    .siblings().not('.form').addClass('inactive');

                this.saveData(this.model.data);
            });
            window.eventHub.on('selected', (data)=> {
                this.view.clearInactive();
                this.model.data = data;
                this.view.render(this.model.data);
                this.view.$el.find('span.selected')
                    .removeClass('inactive')
                    .siblings().not('.form').addClass('inactive');
            });
            window.eventHub.on('new-song', ()=> {
                this.view.$el.addClass('inactive');
            });
        },
        saveData(data) {
            this.model.save(data).then( ()=> {
                    let dataCopy = JSON.parse(JSON.stringify(this.model.data));
                    window.eventHub.emit('save', dataCopy);
                    this.view.clearInactive();
                }, (error)=> { console.log(error); }
            );
        },
        updateData(data) {
            this.model.update(data).then( ()=> {
                    this.view.clean();
                    let dataCopy = JSON.parse(JSON.stringify(this.model.data));
                    window.eventHub.emit('update', dataCopy);
                    this.view.$el.addClass('inactive');
                }, (error)=> { console.log(error); }
            );
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e)=> {
                e.preventDefault();
                let needs = 'title author link cover lyric'.split(' ');
                let data = {};
                needs.map((string)=> {
                    data[string] = this.view.$el.find(`input[name=${string}]`).val();
                });
                data['id'] = this.model.data.id;
                data['lyric'] = this.view.$el.find('textarea[name=lyric]').val();
                if (! (data['title'] && data['author'] && data['link']) ) {
                    alert('音乐标题/歌手/歌曲外链都不能为空!请重新填写');
                    return;
                }
                this.updateData(data);
            });
        },
    };

    controller.init(view, model);
}