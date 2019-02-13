{
    let view = {
        el: 'div.page-wrapper',
        init() {
            this.$el = $(this.el);
        },
        find(selector) {
            return $(this.el).find(selector);
        }
    };
    let model = {
        data: {
            title: '', author: '', link: '', cover: '', lyric: '', id: '',
        },
        fetchSongById(id) {
            var Song = new AV.Query('Song');
            return Song.get(id).then((songData)=> {
                let {id, attributes} = songData;
                Object.assign(this.data, {id, ...attributes});
            }, (error)=> { console.log(error); });
        }
    };
    let controller = {
        view: null,
        model: null,
        audio: null,
        init(view, model) {
            this.view = view;
            this.view.init();
            this.model = model;
            this.bindEvents();
            this.initAudio();
        },
        bindEvents() {
            this.view.$el.on('click', (e)=> {
                if (this.audio.paused) {
                    this.play();
                    this.removePauseClassForPlayButton();
                    this.addPlayingClass();
                } else {
                    this.pause();
                    this.addPauseClassForPlayButton();
                    this.removePlayingClass();
                }
            });
        },
        getSongId() {
            let parsedUrl = new URL(window.location.href);
            return parsedUrl.searchParams.get('id');
        },
        onPlayEnd() {
            this.audio.onended = ()=> {
                alert('song is over');
                this.pause();
                this.addPauseClassForPlayButton();
                this.removePlayingClass();
            }
        },
        initAudio() {
            this.model.data.id = this.getSongId();
            this.model.fetchSongById(this.model.data.id).then(()=> {
                let dataCopy = JSON.parse(JSON.stringify(this.model.data));
                this.audio = new Audio(this.model.data.link);
                this.audio.play();
                this.addPlayingClass();
                this.onPlayEnd();
                this.changeCover(this.model.data.cover);
                window.eventHub.emit('xxx', {songData: dataCopy, audio: this.audio});
            });
        },
        play() {
            this.audio.play();
        },
        pause() {
            this.audio.pause();
        },
        addPlayingClass() {
            let discWrapper = this.view.$el.find('section.disc-wrapper');
            $(discWrapper).addClass('playing');
        },
        removePlayingClass() {
            let discWrapper = this.view.$el.find('section.disc-wrapper');
            $(discWrapper).removeClass('playing');
        },
        addPauseClassForPlayButton() {
            let playButton = this.view.$el.find('section.disc-wrapper .disc img.play');
            $(playButton).addClass('pause');
        },
        removePauseClassForPlayButton() {
            let playButton = this.view.$el.find('section.disc-wrapper .disc img.play');
            $(playButton).removeClass('pause');
        },
        changeCover(url) {
            let cover = this.view.$el.find('section.disc-wrapper img.cover');
            $(cover).attr('src', url);
        }
    };

    controller.init(view, model);
}